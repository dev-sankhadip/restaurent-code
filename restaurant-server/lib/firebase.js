const admin = require("firebase-admin");
const { firebaseConfig } = require("../VO/config");

var serviceAccount = require(firebaseConfig.credentialPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: firebaseConfig.databaseURL,
});

module.exports = admin;
