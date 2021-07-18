CREATE TABLE tbl_Admin
(
	Id          Int AUTO_INCREMENT PRIMARY KEY,
    Username	VARCHAR(20) NOT NULL,
    Password    VARCHAR(50) NOT NULL,
    Delete_Flag	VARCHAR(1) DEFAULT 'N'
)