// HR suite controller. Every route in this module is mounted behind authAdmin;
// the public storefront and employee self-service routes remain untouched.
import Employee from "../models/Employee.js";
import PayRun from "../models/PayRun.js";
import PerformanceNote from "../models/PerformanceNote.js";
import TimeOffRequest from "../models/TimeOffRequest.js";
import HrSetting from "../models/HrSetting.js";

const CATALOG_KEY = "catalog";
const trim = (value) => (typeof value === "string" ? value.trim() : "");

const employeePayload = (body) => {
	const payload = {};
	const fields = [
		"name",
		"employeeId",
		"email",
		"phone",
		"address",
		"position",
		"department",
		"payType",
		"color",
		"notes",
	];
	for (const field of fields) {
		if (body[field] !== undefined) payload[field] = trim(body[field]);
	}
	if (!payload.position) payload.position = "Staff";
	if (!payload.department) payload.department = "Sales floor";
	if (!payload.payType) payload.payType = "hourly";
	if (!payload.color) payload.color = "#1e4d43";
	if (body.rate !== undefined) payload.rate = Number(body.rate);
	if (typeof body.active === "boolean") payload.active = body.active;
	return payload;
};

const fail = (res, message, status = 400) =>
	res.status(status).json({ success: false, message });

// ---- Employees ------------------------------------------------------------

export const listHrEmployees = async (_req, res) => {
	try {
		const employees = await Employee.find({}).sort({ active: -1, name: 1 }).lean();
		return res.json({ success: true, employees });
	} catch (error) {
		return fail(res, error.message, 500);
	}
};

export const createHrEmployee = async (req, res) => {
	try {
		const payload = employeePayload(req.body);
		if (!payload.name) return fail(res, "Employee name is required.");
		if (payload.employeeId) {
			const existing = await Employee.findOne({ employeeId: payload.employeeId }).lean();
			if (existing) return fail(res, "That employee ID is already in use.");
		}
		const employee = await Employee.create({ ...payload, rate: payload.rate ?? 0 });
		return res.json({ success: true, employee, message: "Employee added." });
	} catch (error) {
		return fail(res, error.message, 500);
	}
};

export const updateHrEmployee = async (req, res) => {
	try {
		const employee = await Employee.findByIdAndUpdate(
			req.params.id,
			{ $set: employeePayload(req.body) },
			{ new: true, runValidators: true },
		);
		if (!employee) return fail(res, "Employee not found.", 404);
		return res.json({ success: true, employee, message: "Employee updated." });
	} catch (error) {
		return fail(res, error.message, 500);
	}
};

// Status changes are the only supported removal path — records are never deleted.
export const setHrEmployeeStatus = async (req, res) => {
	try {
		if (typeof req.body?.active !== "boolean") {
			return fail(res, "active must be true or false.");
		}
		const employee = await Employee.findByIdAndUpdate(
			req.params.id,
			{ $set: { active: req.body.active } },
			{ new: true },
		);
		if (!employee) return fail(res, "Employee not found.", 404);
		return res.json({
			success: true,
			employee,
			message: employee.active ? "Employee activated." : "Employee deactivated.",
		});
	} catch (error) {
		return fail(res, error.message, 500);
	}
};

// ---- Payroll --------------------------------------------------------------

export const listPayRuns = async (req, res) => {
	try {
		const filter = trim(req.query.employeeId)
			? { employeeId: trim(req.query.employeeId) }
			: {};
		const runs = await PayRun.find(filter).sort({ createdAt: -1 }).lean();
		return res.json({ success: true, payRuns: runs });
	} catch (error) {
		return fail(res, error.message, 500);
	}
};

export const createPayRun = async (req, res) => {
	try {
		const employeeId = trim(req.body.employeeId);
		const employee = await Employee.findOne({ employeeId }).lean();
		if (!employee) return fail(res, "Employee not found.", 404);

		const status = trim(req.body.status) || "pending";
		if (!["paid", "pending"].includes(status)) {
			return fail(res, "Status must be paid or pending.");
		}

		const currentMonth = new Date();
		const period = trim(req.body.period) ||
			currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });
		const run = await PayRun.create({
			employee: employee._id,
			employeeId,
			employeeName: employee.name,
			period,
			startDate: trim(req.body.startDate),
			endDate: trim(req.body.endDate),
			amount: Number(req.body.amount),
			status,
			note: trim(req.body.note),
		});
		return res.json({ success: true, payRun: run, message: "Payroll run recorded." });
	} catch (error) {
		return fail(res, error.message, 500);
	}
};

// ---- Performance notes ----------------------------------------------------

export const listPerformanceNotes = async (req, res) => {
	try {
		const filter = trim(req.query.employeeId)
			? { employeeId: trim(req.query.employeeId) }
			: {};
		const notes = await PerformanceNote.find(filter).sort({ date: -1, createdAt: -1 }).lean();
		return res.json({ success: true, notes });
	} catch (error) {
		return fail(res, error.message, 500);
	}
};

export const createPerformanceNote = async (req, res) => {
	try {
		const employeeId = trim(req.body.employeeId);
		const employee = await Employee.findOne({ employeeId }).lean();
		if (!employee) return fail(res, "Employee not found.", 404);

		const note = await PerformanceNote.create({
			employee: employee._id,
			employeeId,
			employeeName: employee.name,
			author: trim(req.body.author) || "Store Manager",
			date: trim(req.body.date) || new Date().toISOString().slice(0, 10),
			text: trim(req.body.text),
		});
		return res.json({ success: true, note, message: "Performance note added." });
	} catch (error) {
		return fail(res, error.message, 500);
	}
};

// ---- Departments & roles --------------------------------------------------

export const getHrSettings = async (_req, res) => {
	try {
		const settings = await HrSetting.findOne({ key: CATALOG_KEY }).lean();
		return res.json({
			success: true,
			settings: {
				departments: settings?.departments || [],
				roles: settings?.roles || [],
			},
		});
	} catch (error) {
		return fail(res, error.message, 500);
	}
};

export const updateHrSettings = async (req, res) => {
	try {
		const departments = req.body.departments.map((item) => item.trim()).filter(Boolean);
		const roles = req.body.roles.map((item) => item.trim()).filter(Boolean);
		const settings = await HrSetting.findOneAndUpdate(
			{ key: CATALOG_KEY },
			{ $set: { departments, roles } },
			{ upsert: true, new: true, setDefaultsOnInsert: true },
		);
		return res.json({ success: true, settings, message: "HR settings saved." });
	} catch (error) {
		return fail(res, error.message, 500);
	}
};

// ---- Time-off approvals ---------------------------------------------------

export const listTimeOffRequests = async (_req, res) => {
	try {
		const requests = await TimeOffRequest.find({}).sort({ createdAt: -1 }).lean();
		return res.json({ success: true, requests });
	} catch (error) {
		return fail(res, error.message, 500);
	}
};

export const decideTimeOffRequest = async (req, res) => {
	try {
		const request = await TimeOffRequest.findOneAndUpdate(
			{ requestId: req.params.id },
			{
				$set: {
					status: req.body.status,
					decisionNote: trim(req.body.decisionNote),
					decidedAt: new Date().toISOString(),
				},
			},
			{ new: true },
		);
		if (!request) return fail(res, "Time-off request not found.", 404);
		return res.json({ success: true, request, message: `Request ${request.status}.` });
	} catch (error) {
		return fail(res, error.message, 500);
	}
};
