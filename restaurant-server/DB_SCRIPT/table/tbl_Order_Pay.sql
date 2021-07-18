CREATE TABLE tbl_Order_Pay
(
    Order_Id        VARCHAR(20) NOT NULL,
	Pay_Id          VARCHAR(30) NOT NULL,
    Pay_Type        VARCHAR(30) NOT NULL,
    Pay_Method      VARCHAR(1)  NOT NULL,
    Pay_Status      VARCHAR(30) NOT NULL,
    Order_Total     DECIMAL(9,2) NOT NULL,
    Delivery_Charge DECIMAL(9,2) NULL,
    Webhook_Name    VARCHAR(50) NOT NULL,
    Created_On      DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY(Order_Id, Pay_Id, Pay_Status, Webhook_Name)
)