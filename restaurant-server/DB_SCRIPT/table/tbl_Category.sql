Create TABLE tbl_Category
(
    Cat_Id      VARCHAR(10) NOT NULL PRIMARY KEY,
    Cat_Name    Varchar(100) NOT NULL,
    Delete_Flag VARCHAR(1) DEFAULT 'N' NOT NULL
)