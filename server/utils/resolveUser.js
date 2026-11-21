import User from "../models/User.js";

/**
 * Resolve the acting user for customer-owned endpoints.
 *
 * The storefront sends a Clerk identifier on every request (see AppContext's
 * axios interceptor) while older flows authenticate with a signed JWT cookie.
 * This helper accepts either so both sign-in modes can reach profile data.
 * Returns the Mongo user id, or null when no identity could be resolved.
 */
export const resolveUserId = async (request) => {
	const jwtId = request.user?.id || request.user?._id;
	if (jwtId) return String(jwtId);

	const clerkId =
		request.user?.clerkId ||
		request.headers?.clerkid ||
		request.body?.clerkId ||
		null;

	if (clerkId) {
		const user = await User.findOne({ clerkId });
		if (user?._id) return String(user._id);
	}

	return null;
};
