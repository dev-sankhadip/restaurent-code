DROP VIEW IF EXISTS vw_Cart_Det;
CREATE VIEW vw_Cart_Det AS
SELECT tbl_Cart.Firebase_Id, tbl_Cart.Menu_Id, tbl_Category.Cat_Id, tbl_Menu.Menu_Name, tbl_Menu.Menu_Price, tbl_Cart.Menu_Qty from tbl_Cart INNER JOIN tbl_Menu
ON
tbl_Cart.Menu_Id = tbl_Menu.Menu_Id
INNER JOIN tbl_Category
ON
tbl_Category.Cat_Id = tbl_Menu.Cat_Id
INNER JOIN tbl_User
ON
tbl_User.Firebase_Id = tbl_Cart.Firebase_Id
WHERE
tbl_Cart.Delete_Flag = 'N'
AND tbl_Menu.Delete_Flag = 'N'
AND tbl_Category.Delete_Flag = 'N'
AND tbl_User.Delete_Flag = 'N'