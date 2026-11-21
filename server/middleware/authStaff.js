import { readToken, unauthorized, verifyToken } from "./jwt.js";

/**
 * Allows either an admin or an employee to fulfill orders. Accepts the
 * `adminToken` or `employeeToken` httpOnly cookie (or a Bearer token).
 */
const authStaff = (request, response, next) => {
	const configuredAdmin = process.env.ADMIN_EMAIL;

	const admin = verifyToken(readToken(request, "adminToken"));
	if (
		admin &&
		(admin.scope === "admin-demo" ||
			(Boolean(configuredAdmin) && admin.email === configuredAdmin))
	) {
		request.staff = { role: "admin", ...admin };
		return next();
	}

	const employee = verifyToken(readToken(request, "employeeToken"));
	if (employee && (employee.scope === "employee-demo" || employee.employeeId)) {
		request.staff = { role: "employee", ...employee };
		return next();
	}

	return unauthorized(response, "Staff authentication required.");
};

export default authStaff;
