CREATE TABLE tbl_Config
(
	Id              INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    Config_Key      VARCHAR(30) NOT NULL,
    Config_Value    VARCHAR(20) NOT NULL,
    Delete_Flag     VARCHAR(1) DEFAULT 'N' NOT NULL
)