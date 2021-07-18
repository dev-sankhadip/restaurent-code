CREATE TABLE tbl_Order
(
    Firebase_Id     VARCHAR(50) NOT NULL,
    Order_Id        VARCHAR(20) NOT NULL PRIMARY KEY,
    Order_Status    VARCHAR(1) NOT NULL,
    Unacpt_Reason   VARCHAR(5) NULL,
    Order_Type      VARCHAR(1) NOT NULL,
    Addr_Id	        VARCHAR(10) NULL,
    Phone_No        VARCHAR(12) NULL,
    Name            VARCHAR(30) NULL,
    Created_On      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Updated_On      DATETIME NULL,
    Delete_Flag     VARCHAR(1) NOT NULL DEFAULT 'N'
)