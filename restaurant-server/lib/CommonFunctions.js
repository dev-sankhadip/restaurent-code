// const crypto = require("crypto");
const { dayList } = require('../VO/constants');
const { poolConnection } = require("../lib/DBConnection");
const { DBQueries } = require('../VO/constants');
const cryptoJS = require('crypto-js');

// const generateRandomString = (len) => {
//     return crypto.randomBytes(len).toString('hex')
// }

const Make2Byte = (num) => {
    if (num < 10) {
        return `0${num}`;
    }
    return num;
}

const CheckRestaurantOpenOrClose = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let todayDate = new Date(getAuTime('year'), Number(getAuTime('month')) - 1, getAuTime('day'), getAuTime('hour') == 24 ? 0 : getAuTime('hour'), getAuTime('minute'), getAuTime('second'));

            // todayDate = new Date()

            // console.log(todayDate.getHours())
            // console.log(todayDate)

            const curDay = todayDate.getDay();
            const curMonth = todayDate.getMonth() + 1;

            const curTime = `${Make2Byte(todayDate.getHours())}:${Make2Byte(todayDate.getMinutes())}`;

            let columnName = `${dayList[curDay]}_Time`;

            let query = `Select ${columnName} from tbl_Restaurant_Timer Where Month_Ind = ?`

            const [rows] = await poolConnection.execute(query, [curMonth])

            let restuTime = rows[0][columnName]

            const restuOpenTime = restuTime.split("-")[0];
            const restuCloseTime = restuTime.split("-")[1];

            resolve([curTime >= restuOpenTime && curTime <= restuCloseTime, restuOpenTime, restuCloseTime]);
        } catch (error) {
            reject(error);
        }
    })
}

const GetMaxOrderId = async () => {
    try {
        const [rows] = await poolConnection.execute(DBQueries.GetMaxOrderId);
        if (rows.length > 0) {
            return rows[0].MaxOrderId;
        }
        return 1;
    } catch (error) {
        throw error;
    }
}



const VerifyAdminDetails = (request) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { token } = request.url != '/login' ? request.headers : request.body;
            const decryptedToken = cryptoJS.AES.decrypt(token, process.env.ENCKEY);

            const { username, password } = JSON.parse(decryptedToken.toString(cryptoJS.enc.Utf8));

            const hashedPwd = cryptoJS.SHA256(password).toString(cryptoJS.enc.Base64);

            const [rows] = await poolConnection.execute(DBQueries.CheckAdmin, [username, hashedPwd])

            if (rows.length > 0) {
                resolve(true);
                return;
            }

            resolve(false);

        } catch (error) {
            reject(error);
        }
    })
}

const getAuTime = (prop) => {
    const formatDateTime = new Intl.DateTimeFormat("en-AU", {
        timeZone: "Australia/Perth",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        day: "numeric",
        month: "numeric",
        year: "numeric",
        hour12: false
    })

    const auTime = formatDateTime.formatToParts(new Date());
    // console.log(auTime);

    let val;
    auTime.map(({ type, value }) => {
        if (type == prop) {
            val = value;
        }
    })
    return val;
}

const ConvertToAuTime = (date) => {
    // var date = "September 21, 2011 00:00:00";
    var targetTime = new Date(date);
    var timeZoneFromDB = +08.00; //time zone value from database
    //get the timezone offset from local time in minutes
    var tzDifference = timeZoneFromDB * 60 + targetTime.getTimezoneOffset();
    //convert the offset to milliseconds, add to targetTime, and make a new Date
    var offsetTime = new Date(targetTime.getTime() + tzDifference * 60 * 1000);
    return new Date(offsetTime);
}


module.exports = {
    // generateRandomString,
    Make2Byte,
    CheckRestaurantOpenOrClose,
    VerifyAdminDetails,
    GetMaxOrderId,
    ConvertToAuTime
}