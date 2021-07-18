const authRouter = require("./auth.routes"),
  menuRouter = require("./menu.routes"),
  adminRouter = require('./admin.routes'),
  lookupRouter = require('./lookup.routes')

module.exports = {
  authRouter,
  menuRouter,
  adminRouter,
  lookupRouter
};
