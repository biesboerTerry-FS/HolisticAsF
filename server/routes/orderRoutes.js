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

// Demo checkout for the mobile app: no real sign-in. Create a demo address so
// the Order.address ObjectId ref is valid, then hand off to the real Stripe flow.
import Address from "../models/Address.js";

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

orderRouter.post("/cod", authUser, placeOrderCOD);
orderRouter.post("/payment", authUser, placeOrderStripe);
orderRouter.post("/demo-payment", demoUser, placeOrderStripe);
orderRouter.get("/user", authUser, getUserOrders);
// auth disabled for now
orderRouter.get("/admin", /* authAdmin, */ getAllOrders);
orderRouter.post("/status", /* authAdmin, */ updateOrderStatus);

export default orderRouter;
