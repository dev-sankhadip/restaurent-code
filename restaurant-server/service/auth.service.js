const { poolConnection, InsertOrUpdateUsingTransaction } = require("../lib/DBConnection");
const logger = require("../lib/logger");
const { DBQueries } = require('../VO/constants');
const axios = require("axios").default;
const { firebaseConfig } = require("../VO/config");

const signup = async (request, response) => {
  const { name, email, phone_number, user_id, refreshtoken } = request.body;
  try {
    const [rows] = await poolConnection.execute(DBQueries.CheckUserExist, [phone_number, user_id]);
    if (rows.length > 0) {
      response.status(400).send({ msg: "User already exists" });
      return;
    }
    let paramsList = [];
    let queryList = [];

    paramsList.push([user_id, phone_number, name, email]);
    queryList.push(DBQueries.SignupUser);

    paramsList.push([user_id, refreshtoken]);
    queryList.push(DBQueries.StoreToken);

    try {
      await InsertOrUpdateUsingTransaction(queryList, paramsList);
    } catch (error) {
      throw error;
    }
    response.status(200).send({ msg: "User Signedup", name, number: phone_number });
  } catch (error) {
    logger.error(`Signup Error:- ${error} - ${user_id} - ${phone_number}`);
    response.status(500).send({ error, msg: "Internal Server Error" });
  }
};


const RefreshToken = async (request, response) => {
  try {
    const { refreshtoken } = request.headers;
    const res = await axios.post(
      `https://securetoken.googleapis.com/v1/token?key=${firebaseConfig.webApiKey}`,
      { grant_type: "refresh_token", refresh_token: refreshtoken }
    )
    response.status(200).send({ accessToken: 'aaa' });
  }
  catch (err) {
    logger.error(`Signup Error:- ${error}`);
    response.status(500).send({ error, msg: "Internal Server Error" });
  }
}


const Login = async (request, response) => {
  const { user_id, phone_number, refreshtoken } = request.body;
  try {
    const [rows] = await poolConnection.execute(DBQueries.CheckUserExist, [phone_number, user_id]);
    if (rows.length > 0) {
      let paramsList = [];
      let queryList = [];

      paramsList.push([user_id, refreshtoken]);
      queryList.push(DBQueries.StoreToken);

      try {
        await InsertOrUpdateUsingTransaction(queryList, paramsList);
        response.status(200).send({ msg: "User Loggedin", name: rows[0].Name, number: rows[0].Identification });
      } catch (error) {
        throw error;
      }
      return;
    }
    response.status(400).send({ msg: "User doesn't exist" });
  } catch (error) {
    logger.error(`Login Error:- ${error} User ID - ${user_id} Phone Number - ${phone_number}`);
    response.status(500).send({ error, msg: "Internal Server Error" });
  }
}


const CheckUserExistByNumber = async (request, response) => {
  try {
    const { phone_number } = request.body;
    const [rows] = await poolConnection.execute(DBQueries.CheckUserExistByNumber, [phone_number]);
    if (rows.length > 0) {
      response.status(200).send({ msg: "User Found" });
      return;
    }
    response.status(400).send({ msg: "User Not Found" });

  } catch (error) {
    logger.error(`Error:- ${error}`);
    response.status(500).send({ error, msg: "Internal Server Error" });
  }
}

module.exports = {
  signup,
  RefreshToken,
  Login,
  CheckUserExistByNumber
};
