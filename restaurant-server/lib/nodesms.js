const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


module.exports = {
    sendSMS: (phone_number, msg) => {
        return new Promise((resolve, reject) => {
            client.messages
                .create({
                    body: `${msg}`,
                    from: '+14783134337',
                    to: phone_number
                })
                .then((message) => {
                    resolve();
                })
                .catch((err) => {
                    console.log(err);
                    reject(err);
                })
        })
    }
}
