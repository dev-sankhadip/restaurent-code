CREATE TABLE tbl_Restaurant_Timer
(
    Id              Int AUTO_INCREMENT NOT NULL PRIMARY KEY,
	Month_Ind		Int NOT NULL,
    Monday_Time		VARCHAR(10) NOT NULL,
	Tuesday_Time	VARCHAR(10) NOT NULL,
    Wednesday_Time	VARCHAR(10) NOT NULL,
	Thrusday_Time	VARCHAR(10) NOT NULL,
    Friday_Time		VARCHAR(10) NOT NULL,
	Saturday_Time	VARCHAR(10) NOT NULL,
    Sunday_Time		VARCHAR(10) NOT NULL,
    Created_On		DATETIME DEFAULT CURRENT_TIMESTAMP,
    Updated_On      DATETIME DEFAULT NULL
)