require("dotenv").config();

const corsOptions = {
  origin:
    process.env.ENVIORONMENT == "dev"
      ? "http://localhost:4200"
      : process.env.APPLICATION_URL,
  optionsSuccessStatus: 200,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};

const firebaseConfig = {
  databaseURL: process.env.FIREBASE_DB_URL,
  webApiKey: process.env.FIREBASE_WEB_API_KEY,
  credentialPath: process.env.CREDENTIAL_PATH,
};

const port = "5000";

module.exports = {
  corsOptions,
  firebaseConfig,
  port,
};
