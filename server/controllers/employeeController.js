import Employee from "../models/Employee.js";
import Shift from "../models/Shift.js";

// Employees
export const createEmployee = async (req, res) => {
	try {
		const { name, email, phone, position, color, active, notes } = req.body;
		if (!name || !String(name).trim()) {
			return res.json({ success: false, message: "Employee name is required" });
		}
		const employee = await Employee.create({
			name: String(name).trim(),
			email: email || "",
			phone: phone || "",
			position: position || "Staff",
			color: color || "#1e4d43",
			active: active !== undefined ? Boolean(active) : true,
			notes: notes || "",
		});
		res.json({ success: true, employee, message: "Employee created" });
	} catch (error) {
		res.json({ success: false, message: error.message });
	}
};

export const listEmployees = async (req, res) => {
	try {
		const employees = await Employee.find({}).sort({ active: -1, name: 1 });
		res.json({ success: true, employees });
	} catch (error) {
		res.json({ success: false, message: error.message });
	}
};

export const updateEmployee = async (req, res) => {
	try {
		const { id } = req.params;
		const updates = (({ name, email, phone, position, color, active, notes }) => ({
			...(name !== undefined ? { name } : {}),
			...(email !== undefined ? { email } : {}),
			...(phone !== undefined ? { phone } : {}),
			...(position !== undefined ? { position } : {}),
			...(color !== undefined ? { color } : {}),
			...(active !== undefined ? { active } : {}),
			...(notes !== undefined ? { notes } : {}),
		}))(req.body);
		const employee = await Employee.findByIdAndUpdate(id, updates, { new: true });
		if (!employee) return res.json({ success: false, message: "Employee not found" });
		res.json({ success: true, employee, message: "Employee updated" });
	} catch (error) {
		res.json({ success: false, message: error.message });
	}
};

export const deleteEmployee = async (req, res) => {
	try {
		const { id } = req.params;
		const employee = await Employee.findByIdAndDelete(id);
		if (!employee) return res.json({ success: false, message: "Employee not found" });
		await Shift.deleteMany({ employee: id });
		res.json({ success: true, message: "Employee and related shifts deleted" });
	} catch (error) {
		res.json({ success: false, message: error.message });
	}
};

// Shifts
export const createShift = async (req, res) => {
	try {
		const { employee, date, startTime, endTime, role, location, notes, status } = req.body;
		if (!employee || !date || !startTime || !endTime) {
			return res.json({ success: false, message: "Employee, date, start time, and end time are required" });
		}
		const shift = await Shift.create({
			employee,
			date,
			startTime,
			endTime,
			role: role || "",
			location: location || "",
			notes: notes || "",
			status: status || "scheduled",
		});
		const populated = await Shift.findById(shift._id).populate("employee");
		res.json({ success: true, shift: populated, message: "Shift created" });
	} catch (error) {
		res.json({ success: false, message: error.message });
	}
};

export const listShifts = async (req, res) => {
	try {
		const { start, end, employee, date } = req.query;
		const filter = {};
		if (date) filter.date = date;
		if (start || end) {
			filter.date = {};
			if (start) filter.date.$gte = start;
			if (end) filter.date.$lte = end;
		}
		if (employee) filter.employee = employee;
		const shifts = await Shift.find(filter)
			.populate("employee")
			.sort({ date: 1, startTime: 1 });
		res.json({ success: true, shifts });
	} catch (error) {
		res.json({ success: false, message: error.message });
	}
};

export const updateShift = async (req, res) => {
	try {
		const { id } = req.params;
		const updates = (({ employee, date, startTime, endTime, role, location, notes, status }) => ({
			...(employee !== undefined ? { employee } : {}),
			...(date !== undefined ? { date } : {}),
			...(startTime !== undefined ? { startTime } : {}),
			...(endTime !== undefined ? { endTime } : {}),
			...(role !== undefined ? { role } : {}),
			...(location !== undefined ? { location } : {}),
			...(notes !== undefined ? { notes } : {}),
			...(status !== undefined ? { status } : {}),
		}))(req.body);
		const shift = await Shift.findByIdAndUpdate(id, updates, { new: true }).populate("employee");
		if (!shift) return res.json({ success: false, message: "Shift not found" });
		res.json({ success: true, shift, message: "Shift updated" });
	} catch (error) {
		res.json({ success: false, message: error.message });
	}
};

export const deleteShift = async (req, res) => {
	try {
		const { id } = req.params;
		const shift = await Shift.findByIdAndDelete(id);
		if (!shift) return res.json({ success: false, message: "Shift not found" });
		res.json({ success: true, message: "Shift deleted" });
	} catch (error) {
		res.json({ success: false, message: error.message });
	}
};
