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
