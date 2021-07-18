const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const { corsOptions, port } = require("./VO/config");
const { authRouter, menuRouter, adminRouter, lookupRouter } = require("./api/index");
const stripeRouter = require("./api/stripe.route");

const app = express();

app.use('/monitor', express.raw({ type: 'application/json' }), stripeRouter);

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/files", express.static(path.join(__dirname, "public")));

app.use("/auth", authRouter);
app.use("/menu", menuRouter);
app.use("/admin", adminRouter);
app.use("/lookup", lookupRouter);

app.listen(port, () => {
  console.log(`Project running on ${port}`);
});
