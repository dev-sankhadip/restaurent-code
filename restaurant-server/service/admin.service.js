const { poolConnection, InsertOrUpdateUsingTransaction } = require("../lib/DBConnection");
const logger = require("../lib/logger");
const { DBQueries, dayList } = require('../VO/constants');
const TupleDictionary = require("../lib/TupleDictionary");
const { sendSMS } = require("../lib/nodesms");
const { sendMail } = require('../lib/nodemailer')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { VerifyAdminDetails, ConvertToAuTime } = require("../lib/CommonFunctions");


const GetCategory = async (request, response) => {
    try {
        const [rows] = await poolConnection.execute(DBQueries.GetCategoryAdmin)
        if (rows.length == 0) {
            response.status(204).send({});
            return;
        }
        response.status(200).send(rows);
    } catch (error) {
        logger.error(error);
        response.status(500).send({ error });
    }
}

const GetMenuByCategory = async (request, response) => {
    try {
        const { cat_id } = request.query;
        const [rows] = await poolConnection.execute(DBQueries.GetMenuByCategory, [cat_id])
        if (rows.length == 0) {
            response.status(204).send({});
            return;
        }
        response.status(200).send(rows);
    } catch (error) {
        logger.error(error);
        response.status(500).send({ error });
    }
}


const AddMenu = async (request, response) => {
    try {
        const { name, desc, price, cat_id } = request.body;
        const [rows] = await poolConnection.execute(DBQueries.CheckIfCategoryExists, [cat_id])
        if (rows.length > 0) {
            const [res] = await poolConnection.execute(DBQueries.GetMaxMenuId);
            let MaxId = res.length == 0 ? 1 : res[0].MaxId
            try {
                await InsertOrUpdateUsingTransaction([DBQueries.CreateMenu], [[cat_id, `BSM${MaxId}`, name, price, desc]]);
            } catch (error) {
                throw error;
            }
            response.status(200).send({ msg: "New Menu Added" });
            return;
        }
        response.status(400).send({ msg: "Menu Cateory doesn't exist" });
    } catch (error) {
        logger.error(error);
        response.status(500).send({ error });
    }
}

const DeleteMenuItem = async (request, response) => {
    try {
        const { cat_id, menu_id } = request.query;
        const [rows] = await poolConnection.execute(DBQueries.DeleteMenuAdmin, [menu_id, cat_id]);
        response.status(200).send({ msg: "Successfully Deleted" });
    } catch (error) {
        logger.error(error);
        response.status(500).send({ error });
    }
}

const GetOrderDetails = async (request, response) => {
    try {
        const [orderDetails_row] = await poolConnection.execute(DBQueries.GetOrderDetails);
        if (orderDetails_row.length == 0) {
            response.status(204).send({ msg: "No Order Found" });
            return;
        }
        let orderDetails = new TupleDictionary();
        orderDetails_row.map((item, index) => {
            if (orderDetails.exists([item.Order_Id]))
                orderDetails.put([item.Order_Id], item);
            else
                orderDetails.add([item.Order_Id], item)
        })
        response.status(200).send(orderDetails.get());
    } catch (error) {
        logger.error(error);
        response.status(500).send({ error });
    }
}


const UpdateOrder = async (request, response) => {
    const { orderId, orderStatus, unacptReason } = request.body;
    try {
        let err_msg = [];
        const [orderDetails_row] = await poolConnection.execute(DBQueries.GetOrder, [orderId]);
        if (orderDetails_row.length == 0) {
            err_msg.push("Order Not Found");
        }
        if (err_msg.length == 0) {
            const { Order_Status, Firebase_Id, Pay_Method } = orderDetails_row[0];
            if (Order_Status == 'C') {
                // Update Order Status as recieved
                const payType = Pay_Method == "C" ? "charge" : "payment_intent";
                const getPaymentIdQuery = Pay_Method == 'C' ? DBQueries.GetPaymentId : DBQueries.GetPaymentId + " And Pay_Status = 'succeeded'"

                let refund = null;
                if (orderStatus == 'U') {
                    const [Pay_Row] = await poolConnection.execute(getPaymentIdQuery, [orderId, payType]);
                    const { Pay_Id } = Pay_Row[0];
                    refund = await RefundPayment(Pay_Id, Pay_Method);
                }
                await UpdateOrderStatus(orderId, orderStatus, Firebase_Id, Pay_Method, refund, unacptReason);

                response.status(200).send({ msg: "Order Status Updated" });
                return;
            }
            else if (Order_Status == 'A' && orderStatus == 'U') {
                err_msg.push("Order status can't be updated");
            }
            else if (Order_Status == 'K' && (orderStatus == 'A' || orderStatus == 'U')) {
                err_msg.push("Order status can't be updated");
            }
            else if (Order_Status == 'W' && (orderStatus == 'A' || orderStatus == 'U' || orderStatus == 'K')) {
                err_msg.push("Order status can't be updated");
            }
            else {
                await UpdateOrderStatus(orderId, orderStatus, Firebase_Id, null, null, unacptReason);
                response.status(200).send({ msg: "Order Status Updated" });
                return;
            }
        }
        response.status(403).send({ err_msg });
    } catch (error) {
        logger.error(error);
        response.status(500).send({ msg: error });
    }
}

const UpdateOrderStatus = (orderId, orderStatus, firebaseId, Pay_Method = null, refund = null, unacptReason = null) => {
    return new Promise(async (resolve, reject) => {
        try {
            let queryList = [];
            let paramsList = [];

            if (refund) {
                queryList.push(DBQueries.CreateOrderPay);
                paramsList.push([orderId, refund.id, refund.object, Pay_Method, refund.status, refund.amount / 100, null, 'user']);
            }

            queryList.push(DBQueries.UpdateOrderStatus);
            paramsList.push([orderStatus, unacptReason, orderId]);

            await InsertOrUpdateUsingTransaction(queryList, paramsList);
            if (orderStatus == 'U' || orderStatus == 'D')
                await sendUpdateToUser(orderStatus, firebaseId, orderId, refund, unacptReason);
            resolve();
        } catch (error) {
            reject(error);
        }
    })
}

const RefundPayment = (paymentId, paymentMethod) => {
    const refundObj = paymentMethod == 'C' ? { charge: paymentId } : { payment_intent: paymentId }
    return new Promise(async (resolve, reject) => {
        try {
            const refund = await stripe.refunds.create(refundObj);
            resolve(refund);
        } catch (error) {
            reject(error.raw.message);
        }
    })
}


const sendUpdateToUser = (orderStatus, Firebase_Id, orderId, refund = null, unacptReason = null) => {
    return new Promise(async (resolve, reject) => {
        try {
            const [userRows] = await poolConnection.execute(DBQueries.GetUserPhoneNumber, [Firebase_Id])
            let no = userRows[0].Identification;
            let email = userRows[0].Email;
            let sub = "";
            let msg = "";
            if (orderStatus == 'U') {
                sub = "Order Rejected"
                const [unacptReason_rows] = await poolConnection.execute(DBQueries.GetUnacptReason, ['Unacpt_Reason', unacptReason]);

                msg = `${unacptReason_rows[0].Lookup_Desc}. Your Order has been rejected. Order Id is ${orderId}. $${refund.amount / 100} will be refunded`
            }
            if (orderStatus == 'D') {
                sub = "Order Delivered"
                msg = `Your Order has been delivered. Order Id is ${orderId}`
            }
            await sendSMS(`+${no}`, msg);
            await sendMail(email, sub, msg);
            resolve();
        } catch (error) {
            reject(error);
        }
    })
}

const SetRestaurantsTime = async (request, response) => {
    try {
        const { day, month, openTime, endTime } = request.body;
        const columnName = `${dayList[day]}_Time`;
        const columnValue = `${openTime}-${endTime}`;

        let query = `Update tbl_Restaurant_Timer SET ${columnName} = ?, Updated_On = CURRENT_TIMESTAMP Where Month_Ind = ?`;

        const [] = await poolConnection.execute(query, [columnValue, month]);
        response.status(200).send({ msg: "Updated" });

    } catch (error) {
        logger.error(error);
        response.status(500).send({ error });
    }
}


const GetAllPastOrders = async (request, response) => {
    try {
        const [rows] = await poolConnection.execute(DBQueries.GetAllPastOrders)
        if (rows.length == 0) {
            response.status(204).send({ msg: "No Order Yet" });
            return;
        }
        let orderDetails = new TupleDictionary();
        rows.map((item, index) => {
            if (orderDetails.exists([item.Order_Id, ConvertToAuTime(item.Created_On)])) {
                orderDetails.put([item.Order_Id, ConvertToAuTime(item.Created_On)], { ...item, Created_On: ConvertToAuTime(item.Created_On) })
            }
            else {
                orderDetails.add([item.Order_Id, ConvertToAuTime(item.Created_On)], { ...item, Created_On: ConvertToAuTime(item.Created_On) });
            }
        })
        response.status(200).send(orderDetails.get())
    } catch (error) {
        logger.error(error);
        response.status(500).send({ error });
    }
}


const Login = async (request, response) => {
    try {
        const IsAdmin = await VerifyAdminDetails(request);
        if (IsAdmin) {
            response.status(200).send({ msg: "Logged in" });
            return;
        }

        response.status(404).send({ msg: "Admin Not Found" })
    } catch (error) {
        logger.error(error);
        response.status(500).send({ error });
    }
}


const RefundDeliveredOrder = async (request, response) => {
    try {
        const { order_id, payMethod } = request.body;
        const payType = payMethod == 'C' ? 'charge' : 'payment_intent';
        const [order_pay_rows] = await poolConnection.execute(DBQueries.AdminRefundOrder, [order_id, payMethod, payType]);

        if (order_pay_rows.length > 0) {
            const { Pay_Id } = order_pay_rows[0];
            const refund = await RefundPayment(Pay_Id, payMethod);

            let queryList = [];
            let paramsList = [];

            queryList.push(DBQueries.CreateOrderPay);
            paramsList.push([order_id, refund.id, refund.object, payMethod, refund.status, refund.amount / 100, null, 'user']);

            await InsertOrUpdateUsingTransaction(queryList, paramsList);

            response.status(200).send({ msg: "Order Refunded" });
            return;
        }
        response.status(400).send({ msg: "Order Payment doesn't exist" });
    } catch (error) {
        logger.error(error);
        response.status(500).send({ msg: error });
    }
}


const MonitorRefundWebhook = async (request, response) => {
    const sig = request.headers['stripe-signature'];
    try {
        // const event = request.body;
        let event = await stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_KEY_REFUND);
        if (event.type == 'charge.refund.updated') {
            const { id, object, status, amount } = event.data.object;
            const [refund_rows] = await poolConnection.execute(DBQueries.CheckIfPaymentTypeExist, [id, 'refund']);

            if (refund_rows.length > 0) {
                const [refund_status_rows] = await poolConnection.execute(DBQueries.CheckIfPaymentTypeExist + ' And Pay_Status = ? And Webhook_Name = ?', [id, 'refund', status, event.type])
                if (refund_status_rows.length == 0) {
                    const { Order_Id, Delivery_Charge, Pay_Method } = refund_rows[0];
                    let queryList = [];
                    let paramsList = [];

                    queryList.push(DBQueries.CreateOrderPay);
                    paramsList.push([Order_Id, id, object, Pay_Method, status, amount / 100, Delivery_Charge, event.type]);

                    await InsertOrUpdateUsingTransaction(queryList, paramsList);
                    response.status(200).send({ msg: "Recieved" })
                }
                else
                    response.status(400).send({ msg: "Multiple Request of same status" });
            }
            else
                response.status(400).send({ msg: "Refund Not Found" });
        }
        else
            response.status(400).send({ msg: "Invalid Request" });
    } catch (error) {
        logger.error(error);
        response.status(500).send({ msg: error });
    }
}


const GetTodaySchedule = async (request, response) => {
    try {
        const today = new Date();
        const columnName = `${dayList[today.getDay()]}_Time`;

        let query = `Select ${columnName} as time From tbl_Restaurant_Timer Where Month_Ind = ?`;

        const [rows] = await poolConnection.execute(query, [today.getMonth() + 1]);
        response.status(200).send(rows);
    } catch (error) {
        logger.error(error);
        response.status(500).send({ msg: error });
    }
}


const GetBillingDetails = async (request, response) => {
    try {
        const [rows] = await poolConnection.execute(DBQueries.GetBillingDetails);
        if (rows.length > 0) {
            return response.status(200).send(rows);
        }
        return response.status(204).send();
    } catch (error) {
        logger.error(error);
        response.status(500).send({ msg: error });
    }
}


module.exports = {
    AddMenu,
    GetOrderDetails,
    UpdateOrder,
    GetCategory,
    GetMenuByCategory,
    DeleteMenuItem,
    SetRestaurantsTime,
    GetAllPastOrders,
    Login,
    RefundDeliveredOrder,
    MonitorRefundWebhook,
    GetTodaySchedule,
    GetBillingDetails
}