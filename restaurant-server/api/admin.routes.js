const adminRouter = require("express").Router();
const { VerifyAdmin } = require("../middleware/verifyAdmin");
const { ValidateRestuTimeSchema } = require("../schema/restu-time");
const adminService = require("../service/admin.service");


adminRouter.get('/order', VerifyAdmin, adminService.GetOrderDetails);
adminRouter.post('/add-menu', VerifyAdmin, adminService.AddMenu);
adminRouter.put('/update-order', VerifyAdmin, adminService.UpdateOrder)
adminRouter.get('/category', VerifyAdmin, adminService.GetCategory)
adminRouter.get('/menu', VerifyAdmin, adminService.GetMenuByCategory)
adminRouter.delete('/menu', VerifyAdmin, adminService.DeleteMenuItem);
adminRouter.put('/update-time', VerifyAdmin, ValidateRestuTimeSchema, adminService.SetRestaurantsTime);
adminRouter.get("/past-order", VerifyAdmin, adminService.GetAllPastOrders);
adminRouter.post('/login', adminService.Login);
adminRouter.post('/refund-order', VerifyAdmin, adminService.RefundDeliveredOrder)
adminRouter.get("/schedule", VerifyAdmin, adminService.GetTodaySchedule);

module.exports = adminRouter;