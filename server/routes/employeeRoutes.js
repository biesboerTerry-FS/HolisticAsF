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
} from "../controllers/employeeController.js";

const employeeRouter = express.Router();

employeeRouter.get("/", listEmployees);
employeeRouter.post("/", createEmployee);
employeeRouter.put("/:id", updateEmployee);
employeeRouter.delete("/:id", deleteEmployee);

employeeRouter.get("/shifts/all", listShifts);
employeeRouter.post("/shifts", createShift);
employeeRouter.put("/shifts/:id", updateShift);
employeeRouter.delete("/shifts/:id", deleteShift);

export default employeeRouter;
