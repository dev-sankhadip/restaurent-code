const mysql = require("mysql2/promise");

const poolConnection = mysql.createPool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DATABASE,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: Number.MAX_SAFE_INTEGER,
  queueLimit: 0,
  port: '3306',
  timezone: "+08:00"
});

const InsertOrUpdateUsingTransaction = (queryList, paramsList) => {
  return new Promise(async (resolve, reject) => {
    const connection = await poolConnection.getConnection();
    await connection.execute("SET TRANSACTION ISOLATION LEVEL READ COMMITTED");
    await connection.beginTransaction();
    try {
      connection.execute("SET time_zone='+08:00';")
      const promises = queryList.map(async (query, index) => {
        try {
          await connection.execute(query, paramsList[index]);
        } catch (error) {
          throw error;
        }
      });
      await Promise.all(promises);
      await connection.commit();
      resolve();
    } catch (error) {
      await connection.rollback();
      reject(error);
    }
  });
};

module.exports = {
  poolConnection,
  InsertOrUpdateUsingTransaction,
};
