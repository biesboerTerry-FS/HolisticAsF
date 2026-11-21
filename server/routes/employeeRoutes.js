import express from "express";
import {
	employeeDemoLogin,
	createEmployee,
	listEmployees,
	updateEmployee,
	deleteEmployee,
	createShift,
	listShifts,
	updateShift,
	deleteShift,
	getMyProfile,
	updateMyProfile,
	getMyShifts,
} from "../controllers/employeeController.js";
import authAdmin from "../middleware/authAdmin.js";
import employeeAuth from "../middleware/employeeAuth.js";
import { demoLimiter, submitLimiter } from "../middleware/rateLimit.js";
import { validateEmployeeProfileUpdate } from "../middleware/validate.js";

const employeeRouter = express.Router();

// Demo self-service session — issues a short-lived employee token.
employeeRouter.post("/demo-login", demoLimiter, employeeDemoLogin);

// Self-service routes: an employee can only read/update their own basic info.
employeeRouter.get("/me", employeeAuth, getMyProfile);
employeeRouter.patch(
	"/me",
	employeeAuth,
	submitLimiter,
	validateEmployeeProfileUpdate,
	updateMyProfile,
);
employeeRouter.get("/me/shifts", employeeAuth, getMyShifts);

// Team/shift management is an admin operation.
employeeRouter.get("/", authAdmin, listEmployees);
employeeRouter.post("/", authAdmin, createEmployee);
employeeRouter.put("/:id", authAdmin, updateEmployee);
employeeRouter.delete("/:id", authAdmin, deleteEmployee);

employeeRouter.get("/shifts/all", authAdmin, listShifts);
employeeRouter.post("/shifts", authAdmin, createShift);
employeeRouter.put("/shifts/:id", authAdmin, updateShift);
employeeRouter.delete("/shifts/:id", authAdmin, deleteShift);

export default employeeRouter;
