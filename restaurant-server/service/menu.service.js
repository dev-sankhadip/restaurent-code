const { ConvertToAuTime } = require("../lib/CommonFunctions");
const { poolConnection, InsertOrUpdateUsingTransaction } = require("../lib/DBConnection");
const logger = require("../lib/logger");
const TupleDictionary = require("../lib/TupleDictionary");
const { DBQueries } = require('../VO/constants');


const getCategoryAndMenu = async (req, res) => {
  try {
    const [rows] = await poolConnection.execute("Select * from vw_Category_Menu");
    if (rows.length > 0) {
      let categoryMenuItems = new TupleDictionary();
      rows.map((item, index) => {
        let menuDetails = [item.Menu_Id, item.Menu_Name, item.Menu_Desc, item.Menu_Price, item.Cat_Id];
        let categoryDetails = [item.Cat_Id, item.Cat_Name];
        if (categoryMenuItems.exists([item.Cat_Id, item.Cat_Name]))
          categoryMenuItems.put(categoryDetails, menuDetails)
        else
          categoryMenuItems.add(categoryDetails, menuDetails)
      })
      res.status(200).send(categoryMenuItems.get());
      return;
    }
    res.status(204).send({ data: [] });
  } catch (err) {
    logger.error(err);
    res.status(500).send({ err });
  }
}


const AddToCart = async (request, response) => {
  const { user_id } = request.decodedClaims;
  try {
    const { menu_id, qty, cat_id } = request.body;
    if (qty == 0) {
      response.status(400).send({ msg: "Menu Quantity can't be 0" });
      return;
    }
    const [rows] = await poolConnection.execute(DBQueries.CheckIfMenuExists, [menu_id, cat_id]);
    if (rows.length > 0) {
      const IsCartUpdated = await UpdateCartItem(user_id, menu_id, qty, "add");
      if (!IsCartUpdated) {
        let paramsList = [];
        let queryList = [];

        paramsList.push([user_id, menu_id, qty]);
        queryList.push(DBQueries.AddToCart);

        try {
          await InsertOrUpdateUsingTransaction(queryList, paramsList);
        } catch (error) {
          throw error;
        }
      }
      response.status(200).send({ msg: "Menu Added to cart" });
      return;
    }
    response.status(400).send({ msg: "Menu doesn't exist" });
  } catch (error) {
    console.log(error);
    logger.error(error);
    response.status(500).send({ error });
  }
}


const UpdateCart = async (request, response) => {
  const { user_id } = request.decodedClaims;
  try {
    const { menu_id, qty } = request.body;
    const IsCartUpdated = await UpdateCartItem(user_id, menu_id, qty);
    if (IsCartUpdated) {
      response.status(200).send({ msg: "Cart Updated" });
      return;
    }
    response.status(400).send({ msg: "Menu Not Found In Cart" });
  } catch (error) {
    logger.error(err);
    response.status(500).send({ err });
  }
}


const UpdateCartItem = (user_id, menu_id, qty, updateType = "update") => {
  return new Promise(async (resolve, reject) => {
    try {
      const [rows] = await poolConnection.execute(DBQueries.CheckMenuExistsInCart, [user_id, menu_id]);
      if (rows.length > 0) {
        let paramsList = [];
        let queryList = [];
        if (updateType == "update")
          queryList.push(DBQueries.UpdateCartItems);
        if (updateType == "add")
          queryList.push(DBQueries.AddCartItems);
        if (qty == 0 && updateType == "update") {
          paramsList.push([qty, 'Y', user_id, menu_id]);
        }
        else {
          paramsList.push([qty, 'N', user_id, menu_id])
        }
        try {
          await InsertOrUpdateUsingTransaction(queryList, paramsList);
        } catch (error) {
          reject(error);
          return;
        }
        // Menu Quantity Updated In Cart
        resolve(true);
        return;
      }
      // Menu Quantity Not Found In Cart
      resolve(false);
    } catch (error) {
      reject(error);
    }
  })
}


const getCartItems = async (request, response) => {
  const { user_id } = request.decodedClaims;
  try {
    const [rows] = await poolConnection.execute(DBQueries.GetCartItems, [user_id])
    if (rows.length == 0) {
      response.status(204).send({ msg: "No Cart Items Found" });
      return;
    }
    response.status(200).send(rows);
  } catch (error) {
    logger.error(error);
    response.status(500).send({ error });
  }
}


const deleteCartItem = async (request, response) => {
  const { user_id } = request.decodedClaims;
  try {
    const { menu_id } = request.query;
    const [rows] = await poolConnection.execute(DBQueries.DeleteCartItem, [user_id, menu_id]);
    response.status(200).send({ msg: "Item removed from Cart" });
  } catch (error) {
    logger.error(error);
    response.status(500).send({ error });
  }
}


const GetUserOrders = async (request, response) => {
  const { user_id } = request.decodedClaims;
  try {
    const [rows] = await poolConnection.execute(DBQueries.GetUserPastOrders, [user_id])
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


const GetOrderStatus = async (request, response) => {
  const { user_id } = request.decodedClaims;
  const { order_id } = request.query;
  try {
    const [rows] = await poolConnection.execute(DBQueries.GetOrderStatus, [user_id, order_id]);
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


const GetAddressListOfUser = async (request, response) => {
  const { user_id } = request.decodedClaims;
  try {
    const [rows] = await poolConnection.execute(DBQueries.GetAddressListOfUser, [user_id])
    if (rows.length > 0) {
      response.status(200).send(rows);
      return;
    }
    response.status(204).send();
  } catch (error) {
    logger.error(error);
    response.status(500).send({ error });
  }
}


module.exports = {
  getCartItems,
  getCategoryAndMenu,
  AddToCart,
  UpdateCart,
  deleteCartItem,
  GetUserOrders,
  GetOrderStatus,
  GetAddressListOfUser
}