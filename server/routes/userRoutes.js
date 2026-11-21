import express from "express";
import {
	registerUser,
	loginUser,
	isAuth,
	logoutUser,
	syncClerkUser,
	getProfile,
	updateProfile,
	demoUserLogin,
} from "../controllers/userController.js";
import authUser from "../middleware/authUser.js";
import { loginLimiter, submitLimiter, demoLimiter } from "../middleware/rateLimit.js";
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
userRouter.post("/demo-login", demoLimiter, demoUserLogin);
userRouter.get("/is-auth", authUser, isAuth);
userRouter.get("/logout", authUser, logoutUser);

// ^ JWT-protected profile endpoints used by /profile
userRouter.get("/profile", authUser, getProfile);
userRouter.patch("/profile", authUser, updateProfile);

export default userRouter;
