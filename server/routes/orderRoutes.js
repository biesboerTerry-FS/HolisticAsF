import express from "express";
import authUser from "../middleware/authUser.js";
// import authAdmin from "../middleware/authAdmin.js";
import {
	placeOrderCOD,
	placeOrderStripe,
	getUserOrders,
	getAllOrders,
	updateOrderStatus,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/cod", authUser, placeOrderCOD);
orderRouter.post("/payment", authUser, placeOrderStripe);
orderRouter.get("/user", authUser, getUserOrders);
// auth disabled for now
orderRouter.get("/admin", /* authAdmin, */ getAllOrders);
orderRouter.post("/status", /* authAdmin, */ updateOrderStatus);

export default orderRouter;
