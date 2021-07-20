const DBQueries = {
  CheckUserExist: "Select * from tbl_User Where Identification = ? and Firebase_Id = ? and Delete_Flag = 'N'",
  SignupUser: "Insert Into tbl_User Values(?,?,?,?, CURRENT_TIMESTAMP, 'N')",
  StoreToken: "Insert Into tbl_Token(Firebase_Id, Refresh_Token) Values(?,?)",
  AddToCart: "Insert Into tbl_Cart(Firebase_Id, Menu_Id, Menu_Qty) Values(?,?,?)",
  CheckMenuExistsInCart: "Select * from tbl_Cart Where Firebase_Id = ? and Menu_Id = ? and Delete_Flag = 'N'",
  UpdateCartItems: "Update tbl_Cart set Menu_Qty = ?, Updated_On = CURRENT_TIMESTAMP, Delete_Flag = ? Where Firebase_Id = ? and Menu_Id = ? and Delete_Flag = 'N'",
  CheckIfMenuExists: "Select * from tbl_Menu Where Menu_Id = ? and Cat_Id = ? and Delete_Flag = 'N'",
  AddCartItems: "Update tbl_Cart set Menu_Qty = Menu_Qty + ?, Updated_On = CURRENT_TIMESTAMP, Delete_Flag = ? Where Firebase_Id = ? and Menu_Id = ? and Delete_Flag = 'N'",
  GetCartItems: "Select * From vw_Cart_Det Where Firebase_Id = ?",
  CheckIfCategoryExists: "Select * from tbl_Category Where Cat_Id = ? and Delete_Flag = 'N'",
  GetMaxMenuId: "SELECT (SUBSTRING(Menu_Id, 4)+1) AS MaxId FROM tbl_Menu ORDER BY MaxId DESC LIMIT 1",
  CreateMenu: "Insert Into tbl_Menu(Cat_Id, Menu_Id, Menu_Name, Menu_Price, Menu_Desc) Values(?,?,?,?,?)",
  DeleteCartItem: "Delete from tbl_Cart Where Firebase_Id = ? and Menu_Id = ?",
  CalculateSubTotal: "SELECT SUM(tbl_Cart.Menu_Qty * tbl_Menu.Menu_Price) as subTotal FROM tbl_Cart INNER JOIN tbl_Menu ON tbl_Cart.Menu_Id = tbl_Menu.Menu_Id WHERE tbl_Cart.Delete_Flag = 'N' AND tbl_Menu.Delete_Flag = 'N' AND tbl_Cart.Firebase_Id = ?",
  CheckUserExistByNumber: "Select * from tbl_User Where Identification = ? and Delete_Flag = 'N'",
  GetLookupValues: "Select * from tbl_Lookup Where Delete_Flag = 'N'",
  GetDeliveryChargeList: "Select SUBSTRING(Config_Key,17) as Config_Key, Config_Value from tbl_Config Where Config_Key like '%delivery_charge%' and Delete_Flag = 'N'",
  GetMinOrderAmount: "Select SUBSTRING(Config_Key,15) as Config_Key, Config_Value from tbl_Config Where Config_Key like '%min_order_amt%' and Delete_Flag = 'N'",
  GetDeliveryCharge: "Select Config_Value from tbl_Config Where Config_Key = ? and Delete_Flag = 'N'",

  CreateMasterOrder: "Insert Into tbl_Order Values(?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP,NULL,'N')",
  CreateOrderDetails: "INSERT INTO tbl_Order_Det SELECT ?, tbl_Cart.Menu_Id, tbl_Cart.Menu_Qty, tbl_Menu.Menu_Price, 'N' from tbl_Cart INNER JOIN tbl_Menu ON tbl_Cart.Menu_Id = tbl_Menu.Menu_Id WHERE tbl_Cart.Delete_Flag = 'N' AND tbl_Menu.Delete_Flag = 'N'  AND tbl_Cart.Firebase_Id = ?",
  CreateAddress: "Insert Into tbl_Addr Values(?,?,?,?,?,?,'N')",
  CreateOrderPay: "Insert Into tbl_Order_Pay Values(?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP)",
  EmptyUserCart: "Delete from tbl_Cart Where Firebase_Id = ?",
  UpdateUserCartStatus: "Update tbl_Cart Set Delete_Flag = ? Where Firebase_Id = ?",
  DeleteCartUponPayment: "DELETE FROM tbl_Cart WHERE Firebase_Id = (SELECT Firebase_Id FROM tbl_Order WHERE Order_Id = ?)",
  UpdateUserCartStatusUponPaymentPrcess: "Update tbl_Cart Set Delete_Flag = ? Where Firebase_Id = (SELECT Firebase_Id FROM tbl_Order WHERE Order_Id = ?)",

  GetUserPhoneNumber: "Select Identification, Email from tbl_User Where Firebase_Id = ? And Delete_Flag = 'N'",
  GetOrderDetails: "Select * from vw_Order_Det Where Order_Status in ('C', 'K', 'W', 'A')",
  GetOrder: "Select Order_Status, Firebase_Id, Pay_Method from tbl_Order INNER JOIN tbl_Order_Pay ON  tbl_Order.Order_Id = tbl_Order_Pay.Order_Id  Where tbl_Order.Order_Id = ? And tbl_Order.Delete_Flag = 'N' LIMIT 1",
  UpdateOrderStatus: "Update tbl_Order SET Order_Status = ?, Unacpt_Reason = ?, Updated_On = CURRENT_TIMESTAMP Where Order_Id = ? And Delete_Flag = 'N'",
  GetPaymentId: "Select Pay_Id from tbl_Order_Pay Where Order_Id = ? And Pay_Type = ?",

  GetUserPastOrders: "Select Order_Id, Order_Type, Order_Status, Order_Status_Desc, Order_Type_Desc, Order_Total, Delivery_Charge, Created_On, Menu_Name, Menu_Qty, Menu_Price, IsRefund from vw_Order_Det Where Firebase_Id = ? Order By Created_On Desc",

  GetCategoryAdmin: "Select Cat_Id, Cat_Name from tbl_Category Where Delete_Flag = 'N'",
  GetMenuByCategory: "Select Menu_Id, Menu_Name, Menu_Price, Menu_Desc from tbl_Menu Where Cat_Id = ? and Delete_Flag = 'N'",
  DeleteMenuAdmin: "Update tbl_Menu Set Delete_Flag = 'Y' Where Menu_Id = ? and Cat_Id = ? and Delete_Flag = 'N'",

  GetRestaurantTime: "Select ?? from tbl_Restaurant_Timer Where Month_Ind = ?",
  GetUnacptReason: "Select Lookup_Desc from tbl_Lookup Where Lookup_Cat = ? And Lookup_Val = ? And Delete_Flag = 'N'",

  GetOrderStatus: "Select Order_Status, Created_On from tbl_Order Where Firebase_Id = ? and Order_Id = ? and Delete_Flag = 'N'",
  GetAllPastOrders: "Select * from vw_Order_Det Where Order_Status in ('U', 'D')  Order By Created_On Desc",

  GetRefreshToken: "Select Refresh_Token from tbl_Token Where Firebase_Id = ? and Delete_Flag = 'N'",
  CheckAdmin: "Select * from tbl_Admin Where username = ? and password = ? and Delete_Flag = 'N'",

  AdminRefundOrder: "Select * from tbl_Order_Pay Where Order_Id = ? and Pay_Method = ? and Pay_Type = ? and Pay_Status = 'succeeded'",
  GetMaxOrderId: "SELECT (SUBSTRING(Order_Id, 3)+1) AS MaxOrderId FROM tbl_Order ORDER BY MaxOrderId DESC LIMIT 1",

  CheckIfPaymentTypeExist: "Select * from tbl_Order_Pay Where Pay_Id = ? And Pay_Type = ?",

  CheckIfPISucedOrFailed: "Select GROUP_CONCAT(Webhook_Name) as Webhook_Name from tbl_Order_Pay Where Pay_Id = ? and Order_Id = ?",

  CheckIfAddressExist: "Select * from tbl_Addr Where Delete_Flag = 'N' And Addr_Id = ?",
  CheckIfDeliveryAreaExist: "Select * from tbl_Lookup Where Delete_Flag = 'N' And Lookup_Cat = ? And Lookup_Val = ?",
  GetAddressListOfUser: "Select (SELECT Lookup_Desc FROM tbl_Lookup WHERE Lookup_Cat = 'Delivery_Area' AND Lookup_Val = tbl_Addr.Delivery_Area) AS Delivery_Area_Desc, tbl_Addr.Full_Addr, tbl_Addr.Zip_Code, tbl_Addr.Landmark, tbl_Addr.State, tbl_Addr.Addr_Id, tbl_Addr.Delivery_Area FROM   tbl_Addr  WHERE Addr_Id IN (SELECT Addr_Id FROM tbl_Order WHERE Firebase_Id = ?) And Delete_Flag = 'N'",

  GetBillingDetails: "Select * from vw_Billing_Det"
};

const dayList = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thrusday', 'Friday', 'Saturday']

const PaymentIntentWebhook = ['payment_intent.processing', 'payment_intent.succeeded', 'payment_intent.payment_failed'];

module.exports = {
  DBQueries,
  dayList,
  PaymentIntentWebhook
}