CREATE TABLE tbl_User
(
    Firebase_Id         VARCHAR(50) NOT NULL,
    Identification      VARCHAR(100) NOT NULL,
    Name                VARCHAR(30) NOT NULL,
    Email               VARCHAR(30) NOT NULL,
    Created_On          DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    Delete_Flag         VARCHAR(1) DEFAULT 'N' NOT NULL,
    PRIMARY KEY(Firebase_Id, Identification)
);