import express from "express";
import authUser from "../middleware/authUser.js";
import authAdmin from "../middleware/authAdmin.js";
import authStaff from "../middleware/authStaff.js";
import { demoLimiter, submitLimiter } from "../middleware/rateLimit.js";
import {
	validateOrderPlacement,
	validateOrderStatus,
	validateStatusValue,
} from "../middleware/validate.js";
import {
	placeOrderCOD,
	placeOrderStripe,
	getUserOrders,
	getAllOrders,
	updateOrderStatus,
	updateOrderStatusById,
} from "../controllers/orderController.js";
import Address from "../models/Address.js";

const orderRouter = express.Router();

// Demo checkout for the mobile app: no real sign-in. Create a demo address so
// the Order.address ObjectId ref is valid, then hand off to the real Stripe flow.
const demoUser = async (request, response, next) => {
	try {
		const userId = "demo-mobile-user";
		request.user = { id: userId };
		const address = await Address.create({
			userId,
			firstName: request.body?.firstName || "Demo",
			lastName: request.body?.lastName || "Trainer",
			streetLine1: request.body?.streetLine1 || "123 Holistic Way",
			city: request.body?.city || "San Diego",
			state: request.body?.state || "CA",
			zipCode: request.body?.zipCode || "92101",
			phone: request.body?.phone || "555-0100",
			email: request.body?.email || "demo@holisticaf.com",
		});
		request.body.address = String(address._id);
		next();
	} catch (error) {
		return response.json({ success: false, message: error.message });
	}
};

orderRouter.post(
	"/cod",
	authUser,
	submitLimiter,
	validateOrderPlacement,
	placeOrderCOD,
);
orderRouter.post(
	"/payment",
	authUser,
	submitLimiter,
	validateOrderPlacement,
	placeOrderStripe,
);
// Public demo checkout (mobile). Deliberately rate-limited and validated.
orderRouter.post(
	"/demo-payment",
	demoLimiter,
	demoUser,
	validateOrderPlacement,
	placeOrderStripe,
);
orderRouter.get("/user", authUser, getUserOrders);
orderRouter.get("/admin", authAdmin, getAllOrders);
// Shared staff feed used by both the admin and employee pending-order widgets.
orderRouter.get("/staff", authStaff, getAllOrders);
orderRouter.post("/status", authAdmin, validateOrderStatus, updateOrderStatus);
// Both admins and employees can advance an order through fulfillment.
orderRouter.patch("/:id/status", authStaff, validateStatusValue, updateOrderStatusById);

export default orderRouter;
