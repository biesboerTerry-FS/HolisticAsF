import jwt from "jsonwebtoken";

// ^ admin login: /api/admin/login
export const adminLogin = async (request, response) => {
	try {
		const { email, password } = request.body;

		if (
			email === process.env.ADMIN_EMAIL &&
			password === process.env.ADMIN_PASSWORD
		) {
			const token = jwt.sign({ email }, process.env.JWT_SECRET, {
				expiresIn: "7d",
			});
			response.cookie("adminToken", token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite:
					process.env.NODE_ENV === "production" ? "none" : "strict",
				maxAge: 7 * 24 * 60 * 60 * 1000,
			});
			return response.json({
				success: true,
				message: "Admin logged in.",
			});
		} else {
			return response.json({
				success: false,
				message: "Invalid credentials",
			});
		}
	} catch (error) {
		console.log(error.message);
		response.json({
			success: false,
			message: error.message,
		});
	}
};

// ^ admin authentication: /api/admin/is-auth
export const isAdminAuth = async (request, response) => {
	try {
		return response.json({
			success: true,
		});
	} catch (error) {
		console.log(error.message);
		response.json({
			success: false,
			message: error.message,
		});
	}
};

// ^ admin logout: /api/admin/logout
export const adminLogout = async (request, response) => {
	try {
		response.clearCookie("adminToken", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
		});
		return response.json({
			success: true,
			message: "Logged out.",
		});
	} catch (error) {
		console.log(error.message);
		response.json({
			success: false,
			message: error.message,
		});
	}
};
