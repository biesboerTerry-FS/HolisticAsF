import Product from "../models/Product.js";
import Order from "../models/Order.js";

// ^ place order cod: /api/order/cod:
export const placeOrderCOD = async (request, response) => {
	try {
		const { userId, items, address } = request.body;
		if (!address || items.length === 0) {
			return response.json({
				success: false,
				message: "Invalid data",
			});
		}
		let amount = await items.reduce(async (account, item) => {
			const product = await Product.findById(item.product);
			return (await account) + product.price * item.quantity;
		}, 0);

		// ^ add tax 7.85%
		amount += Math.floor(amount * 0.0785);
		await Order.create({
			userId,
			items,
			amount,
			address,
			paymentType: "cod",
		});
		return response.json({
			success: true,
			message: "Order placed.",
		});
	} catch (error) {
		return response.json({
			success: false,
			message: error.message,
		});
	}
};

// ^ get user orders by id : /api/order/user
export const getUserOrders = async (request, response) => {
	try {
		const { userId } = request.body;
		const orders = await Order.find({
			userId,
			$or: [{ paymentType: "cod" }, { ispPaid: true }],
		})
			.populate("items.product address")
			.sort({ createdAt: -1 });
		response.json({
			success: true,
			orders,
		});
	} catch (error) {
		response.json({
			success: false,
			message: error.message,
		});
	}
};

// ^ get all orders (admin) : /api/order/admin
export const getAllOrders = async (request, response) => {
	try {
		const orders = await Order.find({
			$or: [{ paymentType: "cod" }, { ispPaid: true }],
		})
			.populate("items.product address")
			.sort({ createdAt: -1 });
		response.json({
			success: true,
			orders,
		});
	} catch (error) {
		response.json({
			success: false,
			message: error.message,
		});
	}
};

// ^ update order status : /api/order/:orderId
// export const updateOrderStatus = async (request, response) => {
// 	try {
// 	} catch (error) {}
// };

// ^ place order Online Payment : /api/order/online
// export const placeOrderOnline = async (request, response) => {
// 	try {
// 	} catch (error) {}
// };
