import express from "express";
import authUser from "../middleware/authUser.js";
import {
	getPaymentMethods,
	addPaymentMethod,
	updatePaymentMethod,
	deletePaymentMethod,
} from "../controllers/paymentMethodController.js";

const paymentMethodRouter = express.Router();

paymentMethodRouter.use(authUser);

paymentMethodRouter.get("/", getPaymentMethods);
paymentMethodRouter.post("/", addPaymentMethod);
paymentMethodRouter.patch("/:id", updatePaymentMethod);
paymentMethodRouter.delete("/:id", deletePaymentMethod);

export default paymentMethodRouter;
