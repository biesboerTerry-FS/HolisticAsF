import express from "express";
import { subscribeToNewsletter } from "../controllers/newsletterController.js";
import { submitLimiter } from "../middleware/rateLimit.js";
import { capBody } from "../middleware/validate.js";

const newsletterRouter = express.Router();

newsletterRouter.post(
	"/subscribe",
	submitLimiter,
	capBody({ email: 254 }),
	subscribeToNewsletter,
);

export default newsletterRouter;
