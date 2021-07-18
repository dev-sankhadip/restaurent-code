const admin = require("../lib/firebase");
const logger = require("../lib/logger");

const verifyIdToken = (req, res, next) => {
  const { accesstoken } = req.headers;

  admin
    .auth()
    .verifyIdToken(accesstoken)
    .then((decodedIdToken) => {
      req.decodedClaims = decodedIdToken;
      next();
    })
    .catch((err) => {
      if (err.code == "auth/id-token-expired") {
        logger.error("Access Token has expired");
      }
      if (err.code == "auth/argument-error") {
        logger.error("Decoding Firebase ID token failed");
      }
      if (err.code == "auth/id-token-revoked") {
        logger.error("Access Token has been revoked");
      }
      res.status(401).send({ err });
    });
};

module.exports = {
  verifyIdToken,
};
