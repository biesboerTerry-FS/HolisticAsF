import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getJwtSecret } from "../middleware/jwt.js";
import { resolveUserId } from "../utils/resolveUser.js";

// ^ register user: /api/user/register
export const registerUser = async (request, response) => {
	try {
		const { name, email, password } = request.body;
		if (!name || !email || !password) {
			return response.json({
				success: false,
				message: "Please provide all required fields",
			});
		}

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return response.json({
				success: false,
				message: "User with this email already exists",
			});
		}
		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await User.create({
			name,
			email,
			password: hashedPassword,
		});

		const token = jwt.sign({ id: user._id }, getJwtSecret(), {
			expiresIn: "1d",
		});
		response.cookie("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		return response.json({
			success: true,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
			},
		});
	} catch (error) {
		console.log(error.message);
		response.json({
			success: false,
			message: error.message,
		});
	}
};

// ^ login userSelect: /api/user/login
export const loginUser = async (request, response) => {
	try {
		const { email, password } = request.body;
		if (!email || !password) {
			return response.json({
				success: false,
				message: "Email and Password required.",
			});
		}

		const user = await User.findOne({ email });
		if (!user) {
			return response.json({
				success: false,
				message: "Invalid email or password",
			});
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return response.json({
				success: false,
				message: "Invalid email or password",
			});
		}

		const token = jwt.sign({ id: user._id }, getJwtSecret(), {
			expiresIn: "7d",
		});

		response.cookie("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		return response.json({
			success: true,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
			},
		});
	} catch (error) {
		console.log(error.message);
		response.json({
			success: false,
			message: error.message,
		});
	}
};

// ^check user authentication: /api/user/is-auth
export const isAuth = async (request, response) => {
	try {
		const userId = request.user.id;
		const user = await User.findById(userId).select("-password");
		return response.json({
			success: true,
			user,
		});
	} catch (error) {
		console.log(error.message);
		response.json({
			success: false,
			message: error.message,
		});
	}
};

// ^ user logout: /api/user/logout
export const logoutUser = async (request, response) => {
	try {
		response.clearCookie("token", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: process.env.NODE_ENV === "production" ? "strict" : "none",
		});
		return response.json({
			success: true,
			message: "Successfully logged out.",
		});
	} catch (error) {
		console.log(error.message);
		response.json({
			success: false,
			message: error.message,
		});
	}
};

// ^ get profile for the storefront account page
export const getProfile = async (request, response) => {
	try {
		const userId = await resolveUserId(request);
		if (!userId) {
			return response.status(401).json({
				success: false,
				message: "Authentication required.",
			});
		}

		const user = await User.findById(userId).select("-password");
		if (!user) {
			return response.status(404).json({
				success: false,
				message: "Profile not found.",
			});
		}

		return response.json({
			success: true,
			user: {
				id: user._id,
				clerkId: user.clerkId,
				name: user.name || "",
				email: user.email || "",
				phone: user.phone || "",
			},
		});
	} catch (error) {
		console.log(error.message, "get profile");
		return response.json({ success: false, message: error.message });
	}
};

// ^ patch name / email / phone from the storefront account page
export const updateProfile = async (request, response) => {
	try {
		const userId = await resolveUserId(request);
		if (!userId) {
			return response.status(401).json({
				success: false,
				message: "Authentication required.",
			});
		}

		const updates = {};
		if (request.body?.name !== undefined) {
			const name = String(request.body.name).trim();
			if (!name) {
				return response.json({
					success: false,
					message: "Name cannot be empty.",
				});
			}
			updates.name = name;
		}
		if (request.body?.email !== undefined) {
			const email = String(request.body.email).trim().toLowerCase();
			if (!/^\S+@\S+\.\S+$/.test(email)) {
				return response.json({
					success: false,
					message: "Please provide a valid email address.",
				});
			}
			const duplicate = await User.findOne({ email, _id: { $ne: userId } });
			if (duplicate) {
				return response.json({
					success: false,
					message: "That email address is already in use.",
				});
			}
			updates.email = email;
		}
		if (request.body?.phone !== undefined) {
			updates.phone = String(request.body.phone).trim();
		}

		if (Object.keys(updates).length === 0) {
			return response.json({
				success: false,
				message: "No profile changes were provided.",
			});
		}

		const user = await User.findByIdAndUpdate(
			userId,
			{ $set: updates },
			{ new: true, runValidators: true },
		).select("-password");

		return response.json({
			success: true,
			message: "Profile updated.",
			user: {
				id: user._id,
				clerkId: user.clerkId,
				name: user.name,
				email: user.email,
				phone: user.phone || "",
			},
		});
	} catch (error) {
		console.log(error.message, "update profile");
		return response.json({ success: false, message: error.message });
	}
};

// ^ storefront demo session: POST /api/user/demo-login
// Gives the no-Clerk storefront a real, short-lived JWT so profile, address and
// demo-payment routes stay fully JWT-protected even in demo mode.
export const demoUserLogin = async (_request, response) => {
	try {
		const user = await User.findOneAndUpdate(
			{ clerkId: "demo-storefront-user" },
			{
				$setOnInsert: {
					clerkId: "demo-storefront-user",
					name: "Demo Shopper",
					email: "storefront-demo@holisticaf.local",
					phone: "",
					cartItems: {},
				},
			},
			{ upsert: true, new: true, setDefaultsOnInsert: true },
		);

		const token = jwt.sign({ id: user._id }, getJwtSecret(), {
			expiresIn: "12h",
		});
		response.cookie("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
			maxAge: 12 * 60 * 60 * 1000,
		});

		return response.json({
			success: true,
			message: "Demo storefront session started.",
			user: { id: user._id, name: user.name, email: user.email },
		});
	} catch (error) {
		console.log(error.message, "demo user login");
		return response
			.status(500)
			.json({ success: false, message: "Unable to start demo session." });
	}
};

// ^ clerk sync for user
export const syncClerkUser = async (request, response) => {
	try {
		const { clerkId, email, name } = request.body;

		let user = await User.findOne({ $or: [{ email }, { clerkId }] });

		if (user) {
			user.clerkId = clerkId;
			if (!user.name) user.name = name;
			await user.save();
		} else {
			user = await User.create({
				clerkId,
				email,
				name,
				cartItems: {},
			});
		}

		// Never return the stored password hash to the client.
		response.json({
			success: true,
			user: {
				id: user._id,
				clerkId: user.clerkId,
				name: user.name,
				email: user.email,
				role: user.role,
				cartItems: user.cartItems || {},
				orders: user.orders || [],
			},
		});
	} catch (error) {
		response.json({ success: false, message: error.message });
	}
};
