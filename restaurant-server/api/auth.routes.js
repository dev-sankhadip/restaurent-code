const authRouter = require("express").Router();
const axios = require("axios").default;
const { verifyIdToken } = require("../middleware/verifyToken");
const { firebaseConfig } = require("../VO/config");
const { signup, Login, CheckUserExistByNumber } = require('../service/auth.service');

authRouter.post("/refresh-token", (request, response) => {
  const { refreshtoken } = request.body;
  axios
    .post(
      `https://securetoken.googleapis.com/v1/token?key=${firebaseConfig.webApiKey}`,
      { grant_type: "refresh_token", refresh_token: refreshtoken }
    )
    .then((res) => {
      response.status(200).send({ token: res.data.access_token });
    })
    .catch((err) => {
      response.status(400).send({ msg: "Token Refreshing Failed", ForceLogin: true });
    });
});



authRouter.post('/login', Login)

authRouter.post('/signup', signup);

authRouter.get('/check-login', verifyIdToken, (req, res) => {
  res.status(200).send({ msg: "User Authenticated" });
});

authRouter.post('/check-user', CheckUserExistByNumber);

module.exports = authRouter;
