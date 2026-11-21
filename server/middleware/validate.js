// Lightweight input validation for the endpoints that accept user-controlled
// data. Rejects malformed bodies, missing required fields, and oversized input.

const isObject = (value) =>
	Boolean(value) && typeof value === "object" && !Array.isArray(value);

const text = (value) => (typeof value === "string" ? value.trim() : "");

const bad = (response, message) =>
	response.status(400).json({ success: false, message });

/** Reject non-object / empty bodies and cap string field lengths. */
export const capBody = (limits = {}) => (request, response, next) => {
	const body = request.body;
	if (!isObject(body) || Object.keys(body).length === 0) {
		return bad(response, "A valid request body is required.");
	}
	for (const [field, value] of Object.entries(body)) {
		if (typeof value !== "string") continue;
		const max = limits[field] || 500;
		if (value.length > max) {
			return bad(response, `Field "${field}" is too long.`);
		}
	}
	return next();
};

export const validateLogin = (request, response, next) => {
	const { email, password } = isObject(request.body) ? request.body : {};
	const safeEmail = text(email);
	const safePassword = text(password);
	if (!safeEmail || !safePassword) {
		return bad(response, "Email and password are required.");
	}
	if (safeEmail.length > 254 || safePassword.length > 128) {
		return bad(response, "Invalid credentials.");
	}
	if (!/^[^\s@]+@[^\s@]+$/.test(safeEmail)) {
		return bad(response, "Invalid email address.");
	}
	return next();
};

export const validateClerkSync = (request, response, next) => {
	const { clerkId, email, name } = isObject(request.body) ? request.body : {};
	if (!text(clerkId) || text(clerkId).length > 100) {
		return bad(response, "A valid clerkId is required.");
	}
	if (text(email).length > 254 || text(name).length > 120) {
		return bad(response, "Invalid profile data.");
	}
	return next();
};

export const validateRegistration = (request, response, next) => {
	const body = isObject(request.body) ? request.body : {};
	if (text(body.name).length > 120 || text(body.email).length > 254) {
		return bad(response, "Invalid profile data.");
	}
	if (typeof body.password !== "string" || body.password.length > 128) {
		return bad(response, "Invalid password.");
	}
	return next();
};

export const validateOrderPlacement = (request, response, next) => {
	const body = isObject(request.body) ? request.body : {};
	const { items, address } = body;

	if (!address || (!text(address) && !isObject(address))) {
		return bad(response, "A delivery address is required.");
	}
	if (!Array.isArray(items) || items.length === 0) {
		return bad(response, "At least one item is required.");
	}
	if (items.length > 100) {
		return bad(response, "Too many items in the order.");
	}

	for (const item of items) {
		if (!isObject(item) || !text(item.productId)) {
			return bad(response, "Malformed order item.");
		}
		const quantity = Number(item.quantity);
		if (!Number.isFinite(quantity) || quantity < 1 || quantity > 99) {
			return bad(response, "Invalid item quantity.");
		}
		if (
			item.price !== undefined &&
			(!Number.isFinite(Number(item.price)) || Number(item.price) < 0)
		) {
			return bad(response, "Invalid item price.");
		}
	}

	return capBody({
		firstName: 100,
		lastName: 100,
		streetLine1: 200,
		city: 100,
		state: 100,
		zipCode: 20,
		phone: 40,
		email: 254,
		name: 200,
		productSource: 40,
	})(request, response, next);
};

export const validateEmployeeProfileUpdate = (request, response, next) => {
	const body = request.body;
	if (!isObject(body) || Object.keys(body).length === 0) {
		return bad(response, "No fields to update.");
	}
	const allowed = ["name", "email", "phone", "address", "employeeId"];
	for (const field of allowed) {
		const value = body[field];
		if (value === undefined) continue;
		if (typeof value !== "string") {
			return bad(response, `Invalid ${field}.`);
		}
		if (value.length > 200) {
			return bad(response, `${field} is too long.`);
		}
	}
	if (body.name !== undefined && !text(body.name)) {
		return bad(response, "Name is required.");
	}
	return next();
};

export const validateAnnouncement = (request, response, next) => {
	const body = isObject(request.body) ? request.body : {};
	if (text(body.title).length > 200 || text(body.body).length > 4000) {
		return bad(response, "Announcement content is too long.");
	}
	return next();
};

export const validateStatusValue = (request, response, next) => {
	const status = isObject(request.body) ? request.body.status : undefined;
	if (!text(status) || text(status).length > 50) {
		return bad(response, "A valid status is required.");
	}
	return next();
};

export const validateOrderStatus = (request, response, next) => {
	const { orderId, status } = isObject(request.body) ? request.body : {};
	if (!text(orderId) || !text(status) || status.length > 50) {
		return bad(response, "orderId and status are required.");
	}
	return next();
};

// ---- HR suite -------------------------------------------------------------

const HR_EMPLOYEE_FIELDS = {
	name: 120,
	employeeId: 100,
	email: 254,
	phone: 40,
	address: 200,
	position: 120,
	department: 120,
	payType: 20,
	color: 20,
	notes: 1000,
};

/** Shared validation for HR employee create/update payloads. */
export const validateHrEmployee = (request, response, next) => {
	const body = request.body;
	if (!isObject(body) || Object.keys(body).length === 0) {
		return bad(response, "A valid employee payload is required.");
	}
	for (const [field, max] of Object.entries(HR_EMPLOYEE_FIELDS)) {
		if (body[field] === undefined) continue;
		if (typeof body[field] !== "string") return bad(response, `Invalid ${field}.`);
		if (body[field].length > max) return bad(response, `${field} is too long.`);
	}
	if (body.name !== undefined && !text(body.name)) {
		return bad(response, "Employee name is required.");
	}
	if (text(body.email) && !/^[^\s@]+@[^\s@]+$/.test(text(body.email))) {
		return bad(response, "Invalid email address.");
	}
	if (body.rate !== undefined) {
		const rate = Number(body.rate);
		if (!Number.isFinite(rate) || rate < 0 || rate > 10_000_000) {
			return bad(response, "Invalid pay rate.");
		}
	}
	if (body.payType !== undefined && !["hourly", "salary"].includes(text(body.payType))) {
		return bad(response, "payType must be hourly or salary.");
	}
	if (body.active !== undefined && typeof body.active !== "boolean") {
		return bad(response, "Invalid active status.");
	}
	return next();
};

export const validatePayRun = (request, response, next) => {
	const body = request.body;
	if (!isObject(body)) return bad(response, "A valid payroll payload is required.");
	const amount = Number(body.amount);
	if (!Number.isFinite(amount) || amount < 0 || amount > 10_000_000) {
		return bad(response, "A valid pay amount is required.");
	}
	if (!text(body.period) || text(body.period).length > 60) {
		return bad(response, "A pay period is required.");
	}
	if (!text(body.employeeId) || text(body.employeeId).length > 100) {
		return bad(response, "Select an employee.");
	}
	if (text(body.note).length > 500) {
		return bad(response, "Payroll note is too long.");
	}
	return next();
};

export const validatePerformanceNote = (request, response, next) => {
	const body = request.body;
	if (!isObject(body)) return bad(response, "A valid note payload is required.");
	if (!text(body.employeeId) || text(body.employeeId).length > 100) {
		return bad(response, "Select an employee.");
	}
	if (!text(body.text) || text(body.text).length > 2000) {
		return bad(response, "A note between 1 and 2000 characters is required.");
	}
	if (text(body.author).length > 120 || text(body.date).length > 30) {
		return bad(response, "Invalid note metadata.");
	}
	return next();
};

export const validateHrSettings = (request, response, next) => {
	const body = request.body;
	const validList = (value) =>
		Array.isArray(value) &&
		value.length <= 100 &&
		value.every((item) => typeof item === "string" && item.trim() && item.length <= 120);
	if (!isObject(body) || !validList(body.departments) || !validList(body.roles)) {
		return bad(response, "departments and roles must be lists of labels.");
	}
	return next();
};

export const validateTimeOffDecision = (request, response, next) => {
	const status = text(request.body?.status);
	if (!["approved", "denied"].includes(status)) {
		return bad(response, "Status must be approved or denied.");
	}
	if (text(request.body?.decisionNote).length > 500) {
		return bad(response, "Decision note is too long.");
	}
	return next();
};
