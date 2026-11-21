import express from "express";
import authAdmin from "../middleware/authAdmin.js";
import ensureHrSeed from "../utils/hrSeed.js";
import {
	validateHrEmployee,
	validateHrSettings,
	validatePayRun,
	validatePerformanceNote,
	validateTimeOffDecision,
} from "../middleware/validate.js";
import {
	createHrEmployee,
	createPayRun,
	createPerformanceNote,
	decideTimeOffRequest,
	getHrSettings,
	listHrEmployees,
	listPayRuns,
	listPerformanceNotes,
	listTimeOffRequests,
	setHrEmployeeStatus,
	updateHrEmployee,
	updateHrSettings,
} from "../controllers/hrController.js";

const hrRouter = express.Router();

// Entire HR suite is admin-only. Self-service and storefront APIs are mounted
// separately and are intentionally unaffected.
hrRouter.use(authAdmin);

// Fresh deployments get realistic demo data on first HR request (idempotent).
hrRouter.use(async (_request, _response, next) => {
	try {
		await ensureHrSeed();
		return next();
	} catch (error) {
		return next(error);
	}
});

// Employee directory / management (status change only — no hard delete).
hrRouter.get("/employees", listHrEmployees);
hrRouter.post("/employees", validateHrEmployee, createHrEmployee);
hrRouter.put("/employees/:id", validateHrEmployee, updateHrEmployee);
hrRouter.patch("/employees/:id/status", setHrEmployeeStatus);

// Payroll history + demo pay runs.
hrRouter.get("/pay-runs", listPayRuns);
hrRouter.post("/pay-runs", validatePayRun, createPayRun);

// Performance notes.
hrRouter.get("/performance-notes", listPerformanceNotes);
hrRouter.post("/performance-notes", validatePerformanceNote, createPerformanceNote);

// Department / role catalog.
hrRouter.get("/settings", getHrSettings);
hrRouter.put("/settings", validateHrSettings, updateHrSettings);

// Time-off approvals (mirrors the portal's local request store).
hrRouter.get("/timeoff", listTimeOffRequests);
hrRouter.patch("/timeoff/:id", validateTimeOffDecision, decideTimeOffRequest);

export default hrRouter;
