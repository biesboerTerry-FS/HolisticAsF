import express from "express";
import {
	adminLogin,
	adminDemoLogin,
	isAdminAuth,
	adminLogout,
} from "../controllers/adminController.js";
import authAdmin from "../middleware/authAdmin.js";
import { demoLimiter, loginLimiter } from "../middleware/rateLimit.js";
import { validateLogin } from "../middleware/validate.js";

const adminRouter = express.Router();

adminRouter.post("/login", loginLimiter, validateLogin, adminLogin);
adminRouter.post("/demo-login", demoLimiter, adminDemoLogin);
adminRouter.get("/is-auth", authAdmin, isAdminAuth);
adminRouter.get("/logout", authAdmin, adminLogout);

export default adminRouter;
