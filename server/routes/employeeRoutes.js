import express from "express";
import {
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

const employeeRouter = express.Router();

// Self-service routes (demo, no auth): only the employee's own basic info.
employeeRouter.get("/me", getMyProfile);
employeeRouter.patch("/me", updateMyProfile);
employeeRouter.get("/me/shifts", getMyShifts);

employeeRouter.get("/", listEmployees);
employeeRouter.post("/", createEmployee);
employeeRouter.put("/:id", updateEmployee);
employeeRouter.delete("/:id", deleteEmployee);

employeeRouter.get("/shifts/all", listShifts);
employeeRouter.post("/shifts", createShift);
employeeRouter.put("/shifts/:id", updateShift);
employeeRouter.delete("/shifts/:id", deleteShift);

export default employeeRouter;
