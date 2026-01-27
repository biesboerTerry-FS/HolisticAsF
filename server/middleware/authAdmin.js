import jwt from "jsonwebtoken";

const authAdmin = async (request, response, next) => {
	const { adminToken } = request.cookies;

	if (!adminToken) {
		return response.json({
			success: false,
			message: "Not authorized.",
		});
	}

	try {
		const tokenDecode = jwt.verify(adminToken, process.env.JWT_SECRET);

		if (tokenDecode.email === process.env.ADMIN_EMAIL) {
			next();
		} else {
			return response.json({
				success: false,
				message: "Not authorized.",
			});
		}
	} catch (error) {
		response.json({
			success: false,
			message: error.message,
		});
	}
};

export default authAdmin;
