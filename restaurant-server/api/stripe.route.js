const stripeRouter = require("express").Router();
const adminService = require("../service/admin.service");
const { MonitorPaymentIntentWebhook } = require("../service/payment.service");



stripeRouter.post('/refund', adminService.MonitorRefundWebhook);

stripeRouter.post('/payment-intent', MonitorPaymentIntentWebhook);

module.exports = stripeRouter;