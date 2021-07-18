const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


module.exports = {
    sendMail: (mailId, subject, msg) => {
        return new Promise((resolve, reject) => {
            const emails = [
                {
                    to: mailId,
                    from: "sankhadipsamanta59@gmail.com",
                    subject: `${subject}`,
                    html: `<strong>${msg}</strong>`,
                }
            ];
            sgMail.send(emails).then(
                () => { resolve(); },
                (error) => {
                    console.error(error);

                    if (error.response) {
                        console.error(error.response.body);
                    }
                    reject();
                }
            );
        })
    }
}


//Following are examples how to use Sendgrid Mail ID

// const emails = [
//   {
//     to: email,
//     from: "sankhadipsamanta59@gmail.com",
//     subject: "Signup Alert",
//     html: `<strong>You have successfully signed up, <strong>User ID:</strong> ${user_id}`,
//   },
//   {
//     to: "pushkardhall@gmail.com",
//     from: "sankhadipsamanta59@gmail.com",
//     subject: "New User Signup Alert",
//     html: `New User successfully signed up, <strong>User ID:</strong> ${user_id} <strong>Phone No:</strong> ${phone_number}`,
//   },
// ];
// sgMail.send(emails).then(
//   () => {},
//   (error) => {
//     console.error(error);

//     if (error.response) {
//       console.error(error.response.body);
//     }
//   }
// );

