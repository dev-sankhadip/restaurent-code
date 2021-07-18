const { getCategoryAndMenu, AddToCart, UpdateCart, getCartItems, deleteCartItem, GetUserOrders, GetOrderStatus, GetAddressListOfUser } = require("../service/menu.service");
const { CheckOutCart, CreatePaymentIntent, CheckIfPaymentSucceedOfFailed } = require('../service/payment.service');
const menuRouter = require("express").Router();
const { verifyIdToken } = require("../middleware/verifyToken");
const { ValidaCheckoutSchema } = require("../schema/check-out");
const { CheckRestuTime } = require("../middleware/CheckIfRestuOpen");

menuRouter.get("/items", getCategoryAndMenu);
menuRouter.post("/add-to-cart", CheckRestuTime, verifyIdToken, AddToCart);
menuRouter.put('/update-cart', CheckRestuTime, verifyIdToken, UpdateCart);
menuRouter.get('/cartitems', verifyIdToken, getCartItems);
menuRouter.delete('/remove-item', CheckRestuTime, verifyIdToken, deleteCartItem);
menuRouter.get('/order', verifyIdToken, GetUserOrders);
menuRouter.get('/orderstatus', verifyIdToken, GetOrderStatus)
menuRouter.post('/payment-status', verifyIdToken, CheckIfPaymentSucceedOfFailed)
menuRouter.get('/address-list', verifyIdToken, GetAddressListOfUser)

menuRouter.post('/check-out', CheckRestuTime, verifyIdToken, ValidaCheckoutSchema, CheckOutCart);


module.exports = menuRouter;
