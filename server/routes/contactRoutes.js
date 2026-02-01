import express from "express";
import {
	submitContact,
	getContactMessages,
	getUnreadMessages,
	updateMessageStatus,
	deleteContactMessage,
} from "../controllers/contactController.js";
import authUser from "../middleware/authUser.js";

const contactRouter = express.Router();

contactRouter.post("/submit", submitContact);

contactRouter.get("/admin", getContactMessages);
contactRouter.get("/unread", getUnreadMessages);
contactRouter.put("/:id", updateMessageStatus);
contactRouter.delete("/:id", deleteContactMessage);

export default contactRouter;
