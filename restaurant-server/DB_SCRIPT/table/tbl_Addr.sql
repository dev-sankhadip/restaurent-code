CREATE TABLE tbl_Addr
(
    Addr_Id	        VARCHAR(10) NOT NULL PRIMARY KEY,
    Delivery_Area   VARCHAR(20) NOT NULL,
    Full_Addr	    VARCHAR(100) NOT NULL,
    Zip_Code        VARCHAR(10) NOT NULL,
    Landmark        VARCHAR(100) NOT NULL,
    State           VARCHAR(20) NOT NULL,
    Delete_Flag     VARCHAR(1) NOT NULL DEFAULT 'N'
)