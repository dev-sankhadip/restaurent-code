DROP VIEW IF EXISTS vw_Billing_Det;
CREATE VIEW vw_Billing_Det AS
SELECT tbl_Order.Order_Id, 
tbl_Order.Created_On, 
tbl_Order.Order_Type, 
tbl_Order_Pay.Order_Total, 
(tbl_Order_Pay.Order_Total + IFNULL(tbl_Order_Pay.Delivery_Charge, 0)) AS Total_Amount,
tbl_User.Identification,
tbl_Addr.Delivery_Area,
tbl_Addr.Full_Addr,
tbl_Addr.Zip_Code,
tbl_Addr.Landmark,
tbl_Addr.State,
CONCAT(tbl_Addr.Full_Addr, ', ', tbl_Addr.Landmark, ', ', tbl_Addr.Zip_Code) as Address,
(SELECT Lookup_Desc FROM tbl_Lookup WHERE Lookup_Cat = 'Order_Type' AND Lookup_val = tbl_Order.Order_Type AND Delete_Flag = 'N') AS Order_Type_Desc,
(SELECT Lookup_Desc FROM tbl_Lookup WHERE Lookup_Cat = 'Delivery_Area' AND Lookup_val = tbl_Addr.Delivery_Area AND Delete_Flag = 'N') AS Delivery_Area_Desc

FROM tbl_Order
INNER JOIN tbl_User
ON tbl_Order.Firebase_Id = tbl_User.Firebase_Id
INNER JOIN tbl_Order_Pay
ON tbl_Order.Order_Id = tbl_Order_Pay.Order_Id
AND tbl_Order_Pay.Pay_Type = 'charge'
LEFT JOIN tbl_Addr
ON tbl_Order.Addr_Id = tbl_Addr.Addr_Id
WHERE
tbl_User.Delete_Flag = 'N'