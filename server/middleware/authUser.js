import { readToken, unauthorized, verifyToken } from "./jwt.js";

/**
 * Guards customer-owned data (cart, addresses, orders). Accepts the httpOnly
 * `token` cookie issued on login/register (or a Bearer token), verifies the
 * signature and expiry, and exposes the decoded identity as `request.user`.
 */
const authUser = (request, response, next) => {
	const payload = verifyToken(readToken(request, "token"));
	if (!payload || (!payload.id && !payload.clerkId)) {
		return unauthorized(response, "Authentication required.");
	}

	request.user = payload;
	return next();
};

export default authUser;
