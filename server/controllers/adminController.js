import jwt from "jsonwebtoken";
import { getJwtSecret } from "../middleware/jwt.js";

const cookieOptions = () => ({
	httpOnly: true,
	secure: process.env.NODE_ENV === "production",
	sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
});

// ^ admin login: /api/admin/login
export const adminLogin = async (request, response) => {
	try {
		const { email, password } = request.body;

		if (
			email === process.env.ADMIN_EMAIL &&
			password === process.env.ADMIN_PASSWORD
		) {
			const token = jwt.sign({ email }, getJwtSecret(), {
				expiresIn: "7d",
			});
			response.cookie("adminToken", token, {
				...cookieOptions(),
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
		response.clearCookie("adminToken", cookieOptions());
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

// ^ demo admin session: /api/admin/demo-login
// Issues a short-lived, clearly scoped token so the "Try demo admin" flow can
// call protected admin routes without disabling authentication on them.
export const adminDemoLogin = async (_request, response) => {
	try {
		const email = process.env.ADMIN_EMAIL || "demo-admin@holisticaf.local";
		const token = jwt.sign(
			{ email, scope: "admin-demo", demo: true },
			getJwtSecret(),
			{ expiresIn: "12h" },
		);
		response.cookie("adminToken", token, {
			...cookieOptions(),
			maxAge: 12 * 60 * 60 * 1000,
		});
		return response.json({
			success: true,
			message: "Demo admin session started.",
		});
	} catch (error) {
		console.error("Demo admin login failed:", error.message);
		return response
			.status(500)
			.json({ success: false, message: "Unable to start demo session." });
	}
};
