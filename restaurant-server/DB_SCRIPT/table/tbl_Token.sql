CREATE TABLE tbl_Token
(
	Id              Int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    Firebase_Id     VARCHAR(50) NOT NULL,
    Refresh_Token   VARCHAR(300) NOT NULL,
    Created_On      DATETIME DEFAULT CURRENT_TIMESTAMP,
    Updated_On      DATETIME DEFAULT NULL,
    Delete_Flag     VARCHAR(1) DEFAULT 'N'
)