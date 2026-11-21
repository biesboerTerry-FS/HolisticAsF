import { readToken, unauthorized, verifyToken } from "./jwt.js";

/**
 * Guards privileged admin operations. Accepts the httpOnly `adminToken` cookie
 * set by /api/admin/login (or /api/admin/demo-login), or a Bearer token.
 */
const authAdmin = (request, response, next) => {
	const payload = verifyToken(readToken(request, "adminToken"));
	if (!payload) {
		return unauthorized(response, "Admin authentication required.");
	}

	const configuredAdmin = process.env.ADMIN_EMAIL;
	const isAdmin =
		(payload.scope === "admin-demo" ||
			(Boolean(configuredAdmin) && payload.email === configuredAdmin));

	if (!isAdmin) {
		return unauthorized(response, "Admin authentication required.");
	}

	request.admin = payload;
	return next();
};

export default authAdmin;
