DROP VIEW IF EXISTS vw_Category_Menu;
CREATE VIEW vw_Category_Menu AS 
SELECT tbl_Category.Cat_Id, tbl_Category.Cat_Name, tbl_Menu.Menu_Id, tbl_Menu.Menu_Name, tbl_Menu.Menu_Price, tbl_Menu.Menu_Desc
FROM tbl_Category INNER JOIN tbl_Menu
ON
tbl_Category.Cat_Id = tbl_Menu.Cat_Id
AND tbl_Category.Delete_Flag = 'N'
AND tbl_Menu.Delete_Flag = 'N'