import User from "../models/User.js";

//^ update cart data: /api/cart/update
export const updateCart = async (request, response) => {
	try {
		const userId = request.user.id;
		const { cartItems } = request.body;

		if (!userId) {
			console.log("No user found on request");
			return response.json({
				success: true,
				message: "Please login to continue",
			});
		}

		await User.findByIdAndUpdate(userId, { cartItems });
		// console.log("updateCart success");
		response.json({
			success: true,
			message: "Cart updated.",
		});
	} catch (error) {
		console.log(error.message);
		response.json({
			success: false,
			error: error.message,
		});
	}
};
