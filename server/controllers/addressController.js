import Address from "../models/Address.js";
import User from "../models/User.js";

export const addAddress = async (request, response) => {
	try {
		console.log("=== addAddress API Called ===");
		console.log("request.user:", request.user);
		console.log("request.cookies:", request.cookies);
		if (!request.user) {
			console.error("request.user is undefined!");
			return response.json({
				success: false,
				message: "Authentication failed: user not found in request",
			});
		}

		const userId = request.user.id;
		console.log("userId extracted:", userId);
		const addressData = request.body;
		console.log("addressData:", addressData);

		const address = await Address.create({
			userId,
			...addressData,
		});

		console.log("Address created:", address);

		await User.findByIdAndUpdate(userId, {
			$push: { addresses: address._id },
		});
		console.log("User document updated");

		return response.json({
			success: true,
			message: "Address added successfully.",
		});
	} catch (error) {
		console.log(error.message, "Error in addAddress:");
		response.json({
			success: false,
			message: error.message,
		});
	}
};

// ^ get addresses: /api/address/get-addresses
export const getAddresses = async (request, response) => {
	try {
		const userId = request.user.id;
		const addresses = await Address.find({ userId });

		response.json({
			success: true,
			addresses,
		});
	} catch (error) {
		console.log(error.message, "get addresses");
		response.json({
			success: false,
			message: error.message,
		});
	}
};
