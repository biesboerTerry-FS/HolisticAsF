import express from "express";
import {
	submitContact,
	getContactMessages,
	getUnreadMessages,
	updateMessageStatus,
	deleteContactMessage,
} from "../controllers/contactController.js";
import authAdmin from "../middleware/authAdmin.js";
import { submitLimiter } from "../middleware/rateLimit.js";
import { capBody } from "../middleware/validate.js";

const contactRouter = express.Router();

// Public contact form — rate-limited and validated so it cannot be abused.
contactRouter.post(
	"/submit",
	submitLimiter,
	capBody({ name: 120, email: 254, subject: 200, message: 4000 }),
	submitContact,
);

// Inbox management is admin-only.
contactRouter.get("/admin", authAdmin, getContactMessages);
contactRouter.get("/unread", authAdmin, getUnreadMessages);
contactRouter.put("/:id", authAdmin, updateMessageStatus);
contactRouter.delete("/:id", authAdmin, deleteContactMessage);

export default contactRouter;
