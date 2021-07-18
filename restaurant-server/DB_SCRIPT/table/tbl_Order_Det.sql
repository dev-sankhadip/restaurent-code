CREATE TABLE tbl_Order_Det
(
    Order_Id    VARCHAR(50) NOT NULL,
    Menu_Id     VARCHAR(20) NOT NULL,
    Menu_Qty    INT NOT NULL,
    Menu_Price  DECIMAL(9,2) NOT NULL,
    Delete_Flag VARCHAR(1) NOT NULL DEFAULT 'N'
)