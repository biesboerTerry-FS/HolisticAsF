import User from "../models/User.js";

const authUser = async (request, response, next) => {
	try {
		const { clerkid } = request.headers;

		console.log("Clerk ID from header:", clerkid ? clerkid : "missing");

		if (!clerkid) {
			return response.json({
				success: false,
				message: "Not Authenticated. Please login via Clerk.",
			});
		}

		const user = await User.findOne({ clerkId: clerkid });

		if (!user) {
			return response.json({
				success: false,
				message: "User not found in database.",
			});
		}

		request.body.userId = user._id;

		next();
	} catch (error) {
		console.error("Authentication error:", error.message);
		return response.json({
			success: false,
			message: error.message,
		});
	}
};

export default authUser;
