const { poolConnection, InsertOrUpdateUsingTransaction } = require("../lib/DBConnection");
const logger = require("../lib/logger");
const { DBQueries, PaymentIntentWebhook, ChargeWebhook } = require('../VO/constants');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const crypto = require("crypto");
const { GetMaxOrderId } = require("../lib/CommonFunctions");


const generateRandomString = (len) => {
    return crypto.randomBytes(len).toString('hex')
}

const CheckOutCart = async (request, response) => {
    const { user_id } = request.decodedClaims;
    const { token: stripeToken, orderType, username, email, paymentMethod, addrId } = request.body;
    let { deliveryArea } = request.body;
    try {
        let err_msg = [];
        let delivery_charge = 0;
        if (orderType == 'D') {
            if (addrId) {
                const [address_row] = await poolConnection.execute(DBQueries.CheckIfAddressExist, [addrId])
                if (address_row.length > 0) {
                    deliveryArea = address_row[0].Delivery_Area;
                }
                else
                    err_msg.push("Selected Address Not Found");
            }
            const [delivery_charge_row] = await poolConnection.execute(DBQueries.GetDeliveryCharge, [`delivery_charge_${deliveryArea}`])
            if (delivery_charge_row.length > 0) {
                delivery_charge = delivery_charge_row[0].Config_Value;
            }
            else
                err_msg.push("Delivery Charge Not Found");
        }
        if (err_msg.length == 0) {
            const [subTotal_rows] = await poolConnection.execute(DBQueries.CalculateSubTotal, [user_id]);
            if (subTotal_rows.length == 0) {
                err_msg.push("No Item found in Cart");
            }
            else {
                const totalAmount = (parseFloat(subTotal_rows[0].subTotal) + parseFloat(delivery_charge));
                // const totalAmountToBePaidTemp = parseInt((totalAmount * 100));
                const totalAmountToBePaid = parseInt((totalAmount * 100).toPrecision(parseInt(totalAmount).toString().length + 2))
                // if (paymentMethod == 'C') {
                //     const payment = await ProcessPayment(totalAmountToBePaid, stripeToken);
                //     if (payment.status != 'failed')
                //         const orderId = await ProcessOrderDetails(user_id, payment, totalAmount, delivery_charge, request, paymentMethod, addrId);
                //     let resMsg;
                //     if (payment.status == 'succeeded') {
                //         resMsg = "Order has been placed";
                //     }
                //     if (payment.status == 'failed') {
                //         resMsg = "Order Not Placed. Payment Failed";
                //     }
                //     if (payment.status == 'pending') {
                //         resMsg = "Payment Pending. Order Status will be updated";
                //     }
                //     response.status(200).send({ msg: resMsg, orderId });
                //     return;
                // }

                if (paymentMethod == 'C') {
                    const paymentIntent = await CreatePaymentIntent(totalAmountToBePaid, username, email)
                    const orderId = await ProcessOrderDetails(user_id, paymentIntent, totalAmount, delivery_charge, request, paymentMethod, addrId);
                    response.send({
                        clientSecret: paymentIntent.client_secret,
                        orderId,
                        pi: paymentIntent.id
                    });
                    return;
                }
            }
        }
        response.status(403).send({ err_msg });
    } catch (error) {
        logger.error(error);
        response.status(500).send({ msg: error });
    }
}


const ProcessPayment = (totalAmount, stripeToken) => {
    return new Promise(async (resolve, reject) => {
        try {
            const charge = await stripe.charges.create({
                amount: totalAmount,
                currency: 'aud',
                source: stripeToken,
                capture: false,
            });

            const payment = await stripe.charges.capture(charge.id);

            resolve(payment);
        } catch (error) {
            reject(error.raw.message);
        }
    })
}


const ProcessOrderDetails = (user_id, payment, totalAmount, delivery_charge, request, paymentMethod, selectedAddrId) => {
    const { orderType, deliveryArea, fullAddr, zipCode, landmark, secPhoneNumber, state, username } = request.body;
    return new Promise(async (resolve, reject) => {
        try {
            // const orderId = generateRandomString(3)
            const orderId = "BS" + await GetMaxOrderId();
            const addrId = orderType == 'D' ? (selectedAddrId ? selectedAddrId : generateRandomString(5)) : null;

            let paramsList = [];
            let queryList = [];

            queryList.push(DBQueries.CreateMasterOrder)
            paramsList.push([user_id, orderId, 'C', null, orderType, addrId, secPhoneNumber ?? null, username])

            queryList.push(DBQueries.CreateOrderDetails);
            paramsList.push([orderId, user_id]);

            if (paymentMethod == 'C') {
                queryList.push(DBQueries.UpdateUserCartStatus);
                paramsList.push(['Y', user_id]);
            }

            queryList.push(DBQueries.CreateOrderPay);
            paramsList.push([orderId, payment.id, payment.object, paymentMethod, payment.status, totalAmount, orderType == 'D' ? delivery_charge : null, 'user']);

            if (orderType == 'D' && !selectedAddrId) {
                queryList.push(DBQueries.CreateAddress);
                paramsList.push([addrId, deliveryArea, fullAddr, zipCode, landmark, state ?? null])
            }

            await InsertOrUpdateUsingTransaction(queryList, paramsList);
            resolve(orderId);
        } catch (error) {
            reject(error);
        }
    })
}



const CreatePaymentIntent = (amount, name, email) => {
    return new Promise(async (resolve, reject) => {
        try {
            const customer = await stripe.customers.create({
                name,
                email
            });

            let currency = "AUD";

            // Create a PaymentIntent with the order amount and currency
            const paymentIntent = await stripe.paymentIntents.create({
                amount,
                currency,
                customer: customer.id,
                // setup_future_usage: "off_session",
                // payment_method_types: ["au_becs_debit"]
            });

            resolve(paymentIntent);
        } catch (error) {
            reject(error);
        }
    })
}




const MonitorPaymentIntentWebhook = async (request, response) => {
    const sig = request.headers['stripe-signature'];
    try {
        let event = await stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_KEY_PAYMENT_INTENT);
        if (PaymentIntentWebhook.includes(event.type)) {
            const { id, object, status, amount } = event.data.object;
            const [paymentIntent_rows] = await poolConnection.execute(DBQueries.CheckIfPaymentTypeExist, [id, object]);
            if (paymentIntent_rows.length > 0) {
                const [paymentIntent_status_rows] = await poolConnection.execute(DBQueries.CheckIfPaymentTypeExist + ' And Pay_Status = ? And Webhook_Name = ?', [id, object, status, event.type])
                if (paymentIntent_status_rows.length == 0) {
                    const { Order_Id, Delivery_Charge, Pay_Method } = paymentIntent_rows[0];
                    let queryList = [];
                    let paramsList = [];
                    if (event.type == 'payment_intent.succeeded') {
                        const { id: chargeId, object: chargeObject, status: chargeStatus } = event.data.object.charges.data[0];
                        queryList.push(DBQueries.CreateOrderPay);
                        paramsList.push([Order_Id, chargeId, chargeObject, Pay_Method, chargeStatus, amount / 100, Delivery_Charge, event.type]);

                        queryList.push(DBQueries.DeleteCartUponPayment);
                        paramsList.push([Order_Id]);
                    }

                    if (event.type == 'payment_intent.processing') {
                        queryList.push(DBQueries.UpdateUserCartStatusUponPaymentPrcess);
                        paramsList.push(['Y', Order_Id]);
                    }

                    if (event.type == 'payment_intent.payment_failed') {
                        const [order_rows] = await poolConnection.execute("Select Firebase_Id from tbl_Order Where Order_Id = ?", [Order_Id])
                        queryList.push(DBQueries.UpdateUserCartStatus);
                        paramsList.push(['N', order_rows[0].Firebase_Id]);
                    }

                    queryList.push(DBQueries.CreateOrderPay);
                    paramsList.push([Order_Id, id, object, Pay_Method, status, amount / 100, Delivery_Charge, event.type]);

                    await InsertOrUpdateUsingTransaction(queryList, paramsList);
                    response.status(200).send({ msg: "Recieved" })
                }
                else
                    response.status(400).send({ msg: "Multiple Request of same status" });
            }
            else
                response.status(400).send({ msg: "Payment Intent Not Found" });
        }
        else
            response.status(400).send({ msg: "Invalid Request" });
    } catch (error) {
        logger.error(error);
        response.status(500).send({ msg: error });
    }
}


const CheckIfPaymentSucceedOfFailed = async (request, response) => {
    const { pi, orderId } = request.body;
    try {
        const [rows] = await poolConnection.execute(DBQueries.CheckIfPISucedOrFailed, [pi, orderId]);
        response.status(200).send(rows);
    } catch (error) {
        logger.error(error);
        response.status(500).send({ msg: error });
    }
}


module.exports = {
    CheckOutCart,
    MonitorPaymentIntentWebhook,
    CheckIfPaymentSucceedOfFailed
}