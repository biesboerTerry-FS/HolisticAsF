import Employee from "../models/Employee.js";
import Shift from "../models/Shift.js";

// Demo employee used when the database is empty (local seeding is optional).
const DEMO_EMPLOYEE = {
	employeeId: "demo-employee-1",
	name: "Jordan Rivera",
	email: "jordan@holisticaf.com",
	phone: "(555) 010-2044",
	address: "100 Holistic Way, Portland, OR 97203",
	position: "Store Associate",
};

const pad = (n) => String(n).padStart(2, "0");
const dateFromNow = (days) => {
	const date = new Date();
	date.setDate(date.getDate() + days);
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const DEMO_SHIFTS = [
	{ date: dateFromNow(1), startTime: "09:00", endTime: "17:00", role: "Floor support", location: "HolisticAF Store" },
	{ date: dateFromNow(3), startTime: "10:00", endTime: "18:00", role: "Inventory restock", location: "HolisticAF Store" },
	{ date: dateFromNow(6), startTime: "08:00", endTime: "15:00", role: "Morning prep", location: "HolisticAF Store" },
].map((shift, index) => ({
	_id: `demo-shift-${index + 1}`,
	employeeId: DEMO_EMPLOYEE.employeeId,
	status: "scheduled",
	...shift,
}));

// Only the fields an employee is allowed to see about themselves.
const publicEmployee = (employee) => ({
	employeeId: employee.employeeId || DEMO_EMPLOYEE.employeeId,
	name: employee.name,
	email: employee.email || "",
	phone: employee.phone || "",
	address: employee.address || "",
	position: employee.position || "Staff",
});

const myEmployeeQuery = (source = {}) => {
	const employeeId = String(source.employeeId || source.id || DEMO_EMPLOYEE.employeeId);
	const email = String(source.email || "").trim().toLowerCase();
	return { employeeId, email };
};

const findMyEmployee = async (source) => {
	const { employeeId, email } = myEmployeeQuery(source);
	let employee = await Employee.findOne({ employeeId });
	if (!employee && email) employee = await Employee.findOne({ email });
	return employee;
};

// GET /api/employees/me
export const getMyProfile = async (req, res) => {
	try {
		const employee = await findMyEmployee({ ...req.query, ...req.body });
		res.json({
			success: true,
			employee: employee ? publicEmployee(employee) : publicEmployee(DEMO_EMPLOYEE),
			demo: !employee,
		});
	} catch (error) {
		res.json({ success: false, message: error.message });
	}
};

// PATCH /api/employees/me — whitelist only the employee's own basic info.
export const updateMyProfile = async (req, res) => {
	try {
		const allowed = ["name", "email", "phone", "address"];
		const updates = {};
		for (const field of allowed) {
			if (req.body?.[field] !== undefined) {
				updates[field] = String(req.body[field]).trim();
			}
		}
		if (Object.keys(updates).length === 0) {
			return res.json({ success: false, message: "No allowed fields to update" });
		}
		if (updates.name === "") {
			return res.json({ success: false, message: "Name is required" });
		}

		const { employeeId } = myEmployeeQuery({ ...req.query, ...req.body });
		let employee = await findMyEmployee({ ...req.query, ...req.body });
		if (employee) {
			employee.set(updates);
			await employee.save();
		} else {
			employee = await Employee.create({
				...DEMO_EMPLOYEE,
				employeeId: employeeId || DEMO_EMPLOYEE.employeeId,
				...updates,
			});
		}
		res.json({ success: true, employee: publicEmployee(employee), message: "Profile updated" });
	} catch (error) {
		res.json({ success: false, message: error.message });
	}
};

// GET /api/employees/me/shifts
export const getMyShifts = async (req, res) => {
	try {
		const employee = await findMyEmployee(req.query);
		let shifts = [];
		if (employee) {
			const today = dateFromNow(0);
			const rows = await Shift.find({
				employee: employee._id,
				date: { $gte: today },
				status: "scheduled",
			})
				.sort({ date: 1, startTime: 1 })
				.lean();
			shifts = rows.map((shift) => ({
				_id: String(shift._id),
				date: shift.date,
				startTime: shift.startTime,
				endTime: shift.endTime,
				role: shift.role || "",
				location: shift.location || "",
				status: shift.status,
			}));
		}
		if (shifts.length === 0) shifts = DEMO_SHIFTS;
		res.json({ success: true, shifts });
	} catch (error) {
		res.json({ success: false, message: error.message });
	}
};

// Employees
export const createEmployee = async (req, res) => {
	try {
		const { name, employeeId, email, phone, address, position, color, active, notes } = req.body;
		if (!name || !String(name).trim()) {
			return res.json({ success: false, message: "Employee name is required" });
		}
		const employee = await Employee.create({
			name: String(name).trim(),
			employeeId: employeeId || "",
			email: email || "",
			phone: phone || "",
			address: address || "",
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
		const updates = (({ name, email, phone, address, position, color, active, notes }) => ({
			...(name !== undefined ? { name } : {}),
			...(email !== undefined ? { email } : {}),
			...(phone !== undefined ? { phone } : {}),
			...(address !== undefined ? { address } : {}),
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
