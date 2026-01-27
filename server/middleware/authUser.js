// import jwt from "jsonwebtoken";

// const authUser = async (request, response, next) => {
// 	const { token } = request.cookies;

// 	if (!token) {
// 		return response.json({
// 			success: false,
// 			message: "Not authorized.",
// 		});
// 	}

// 	try {
// 		const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

// 		if (!tokenDecode.id) {
// 			request.user = tokenDecode;
// 			return response.json({
// 				success: false,
// 				message: "Not authorized",
// 			});
// 		}
// 		request.user = { _id: tokenDecode.id };
// 		next();
// 	} catch (error) {
// 		response.json({
// 			success: false,
// 			message: error.message,
// 		});
// 	}
// };

// export default authUser;

import jwt from "jsonwebtoken";

const authUser = async (request, response, next) => {
	try {
		const token = request.cookies.token; // Token from cookies

		console.log("=== authUser Middleware ===");
		console.log("token:", token ? "exists" : "missing");

		if (!token) {
			return response.json({
				success: false,
				message: "Not Authenticated",
			});
		}

		const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
		console.log("decodedToken:", decodedToken);

		// ✅ IMPORTANT: This sets request.user
		request.user = decodedToken;
		console.log("✅ request.user set:", request.user);

		next();
	} catch (error) {
		console.error("❌ Authentication error:", error.message);
		return response.json({
			success: false,
			message: error.message,
		});
	}
};

export default authUser;
