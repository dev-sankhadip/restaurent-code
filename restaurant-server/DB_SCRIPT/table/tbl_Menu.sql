CREATE TABLE tbl_Menu
(
    Cat_Id	    VARCHAR(10)NOT NULL,
    Menu_Id     VARCHAR(20) NOT NULL,
    Menu_Name   VARCHAR(100) NOT NULL,
    Menu_Price  DECIMAL(9,2) NOT NULL,
    Menu_Desc   VARCHAR(200) NULL,
    Menu_Type   VARCHAR(10) NULL,
    Delete_Flag VARCHAR(1) DEFAULT 'N' NOT NULL,
    PRIMARY KEY(Cat_Id, Menu_Id)
)