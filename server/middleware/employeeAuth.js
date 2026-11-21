import { readToken, unauthorized, verifyToken } from "./jwt.js";

/**
 * Guards employee self-service routes (/api/employees/me*). Accepts the
 * httpOnly `employeeToken` cookie issued by /api/employees/demo-login (or a
 * Bearer token) so the demo portal keeps working without weakening the route.
 */
const employeeAuth = (request, response, next) => {
	const payload = verifyToken(readToken(request, "employeeToken"));
	if (!payload || (payload.scope !== "employee-demo" && !payload.employeeId)) {
		return unauthorized(response, "Employee authentication required.");
	}

	request.employee = payload;
	return next();
};

export default employeeAuth;
