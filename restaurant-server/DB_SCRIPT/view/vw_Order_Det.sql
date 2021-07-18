DROP VIEW IF EXISTS vw_Order_Det;
CREATE VIEW vw_Order_Det AS
SELECT DISTINCT
tbl_User.Firebase_Id,
tbl_Order.Name,
tbl_User.Identification,
tbl_User.Email,
tbl_Order.Order_Id,
tbl_Order.Created_On,
(SELECT Lookup_Desc FROM tbl_Lookup WHERE Lookup_Cat = 'Order_Type' AND Lookup_val = tbl_Order.Order_Type AND Delete_Flag = 'N') AS Order_Type_Desc,
(SELECT Lookup_Desc FROM tbl_Lookup WHERE Lookup_Cat = 'Order_Status' AND Lookup_val = tbl_Order.Order_Status AND Delete_Flag = 'N') AS Order_Status_Desc,
(SELECT Lookup_Desc FROM tbl_Lookup WHERE Lookup_Cat = 'Delivery_Area' AND Lookup_val = tbl_Addr.Delivery_Area AND Delete_Flag = 'N') AS Delivery_Area_Desc,
tbl_Order.Order_Status,
tbl_Order.Order_Type,
tbl_Order_Pay.Order_Total,
tbl_Addr.Delivery_Area,
tbl_Order_Pay.Delivery_Charge,
tbl_Addr.Full_Addr,
tbl_Addr.Zip_Code,
tbl_Addr.Landmark,
tbl_Addr.State,
tbl_Order_Det.Menu_Id,
tbl_Order_Det.Menu_Qty,
tbl_Order_Det.Menu_Price,
tbl_Menu.Menu_Name,
tbl_Order_Pay.Pay_Method,
(SELECT COUNT(Pay_Status) FROM tbl_Order_Pay WHERE Order_Id = tbl_Order.Order_Id AND Pay_Type = 'refund' AND (Pay_Status = 'succeeded' OR Pay_Status = 'pending')) as IsRefund

FROM tbl_Order INNER JOIN tbl_Order_Det
ON
tbl_Order.Order_Id = tbl_Order_Det.Order_Id
INNER JOIN tbl_Order_Pay
ON
tbl_Order_Pay.Order_Id = tbl_Order.Order_Id
AND tbl_Order_Pay.Pay_Type IN ('charge', 'payment_intent')
AND tbl_Order_Pay.Pay_Status = 'succeeded'
INNER JOIN tbl_Menu
ON
tbl_Menu.Menu_Id = tbl_Order_Det.Menu_Id
INNER JOIN tbl_User
ON
tbl_User.Firebase_Id = tbl_Order.Firebase_Id
LEFT JOIN tbl_Addr
ON
tbl_Order.Addr_Id = tbl_Addr.Addr_Id
AND tbl_Addr.Delete_Flag = 'N'
WHERE
tbl_Order.Delete_Flag = 'N'
AND tbl_Order_Det.Delete_Flag = 'N'
AND tbl_User.Delete_Flag = 'N'