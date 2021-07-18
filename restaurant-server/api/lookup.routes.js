const lookupRouter = require("express").Router();
const { verifyIdToken } = require("../middleware/verifyToken");
const lookupService = require('../service/lookup.service');


lookupRouter.post('/', lookupService.GetLookupValues)
lookupRouter.get('/config', verifyIdToken, lookupService.GetDeliveryCharges);

lookupRouter.get('/time', lookupService.GetRestaurantTime);

lookupRouter.get('/pb-key', lookupService.StripePublishableKey);

module.exports = lookupRouter;