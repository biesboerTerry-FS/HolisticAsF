import jwt from "jsonwebtoken";

const authUser = async (request, response, next) => {
	try {
		const token = request.cookies.token;

		console.log("------------ authUser Middleware ------------");
		console.log("token:", token ? "exists" : "missing");

		if (!token) {
			return response.json({
				success: false,
				message: "Not Authenticated",
			});
		}

		const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
		console.log("decodedToken:", decodedToken);

		request.user = decodedToken;
		console.log("request.user set:", request.user);

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
