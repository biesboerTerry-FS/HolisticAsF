import express from "express";
import authUser from "../middleware/authUser.js";
import authAdmin from "../middleware/authAdmin.js";
import {
	placeOrderCOD,
	getUserOrders,
	getAllOrders,
	updateOrderStatus,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/cod", authUser, placeOrderCOD);
orderRouter.get("/user", authUser, getUserOrders);
orderRouter.get("/admin", authAdmin, getAllOrders);
orderRouter.post("/status", authAdmin, updateOrderStatus);

export default orderRouter;
