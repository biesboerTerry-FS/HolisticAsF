import express from "express";
import {
	registerUser,
	loginUser,
	isAuth,
	logoutUser,
	syncClerkUser,
} from "../controllers/userController.js";
import authUser from "../middleware/authUser.js";
import { loginLimiter, submitLimiter } from "../middleware/rateLimit.js";
import {
	validateClerkSync,
	validateLogin,
	validateRegistration,
} from "../middleware/validate.js";

const userRouter = express.Router();

userRouter.post(
	"/register",
	loginLimiter,
	validateRegistration,
	registerUser,
);
userRouter.post("/login", loginLimiter, validateLogin, loginUser);
userRouter.post("/sync", submitLimiter, validateClerkSync, syncClerkUser);
userRouter.get("/is-auth", authUser, isAuth);
userRouter.get("/logout", authUser, logoutUser);

export default userRouter;
