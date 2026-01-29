import Product from "../models/Product.js";
import KrogerProduct from "../models/KrogerProduct.js";
import Order from "../models/Order.js";
import User from "../models/User.js";

// ^ place order cod: /api/order/cod:
export const placeOrderCOD = async (request, response) => {
	try {
		console.log("========== placeOrderCOD ==========");
		const userId = request.user.id;
		const { items, address } = request.body;
		console.log("userId:", userId);
		console.log("items:", items.length);
		console.log("address:", address);

		if (!address || items.length === 0) {
			return response.json({
				success: false,
				message: "Invalid data",
			});
		}
		let amount = 0;
		for (const item of items) {
			const product = await Product.findById(item.product);
			if (!product) {
				return response.json({
					success: false,
					message: `Product not found: ${item.product}`,
				});
			}
			amount += product.offerPrice * item.quantity;
		}

		// ^ add tax 7.85%
		amount += Math.floor(amount * 0.0785);
		console.log("Total amount with tax:", amount);

		const order = await Order.create({
			userId,
			items,
			amount,
			address,
			paymentType: "cod",
			status: "pending",
		});
		console.log("Order created with ID:", order._id);

		const updatedUser = await User.findByIdAndUpdate(
			userId,
			{ $push: { orders: order._id } },
			{ new: true },
		);

		console.log(
			"Order linked to user, total orders:",
			updatedUser.orders.length,
		);

		return response.json({
			success: true,
			message: "Order placed.",
		});
	} catch (error) {
		console.error("Error in placeOrderCOD:", error.message);
		return response.json({
			success: false,
			message: error.message,
		});
	}
};

// ^ get user orders by id : /api/order/user
export const getUserOrders = async (request, response) => {
	try {
		console.log("========== getUserOrders ==========");
		const userId = request.user.id;
		console.log("userId:", userId);

		const orders = await Order.find({
			userId,
			$or: [{ paymentType: "cod" }, { isPaid: true }],
		})
			.populate({
				path: "items.product",
				model: "Product",
			})
			.populate({
				path: "address",
				model: "Address",
			})
			.sort({ createdAt: -1 });
		console.log(`Found ${orders.length} orders for user ${userId}`);

		response.json({
			success: true,
			orders,
		});
	} catch (error) {
		console.error("Error in getUserOrders:", error.message);
		response.json({
			success: false,
			message: error.message,
		});
	}
};

// ^ get all orders (admin) : /api/order/admin
export const getAllOrders = async (request, response) => {
	try {
		console.log("========== getAllOrders (Admin) ==========");
		const orders = await Order.find({
			$or: [{ paymentType: "cod" }, { isPaid: true }],
		})
			.populate("items.product address")
			.sort({ createdAt: -1 });
		console.log(`Found ${orders.length} total orders`);

		response.json({
			success: true,
			orders,
		});
	} catch (error) {
		console.error("Error in getAllOrders:", error.message);
		response.json({
			success: false,
			message: error.message,
		});
	}
};

// ^ update order status : /api/order/:orderId
export const updateOrderStatus = async (request, response) => {
	try {
		const { orderId } = request.params;
		const { status } = request.body;

		console.log("========== updateOrderStatus ==========");
		console.log("orderId:", orderId);
		console.log("status:", status);

		if (!status) {
			return response.json({
				success: false,
				message: "Status is required",
			});
		}

		const validStatuses = [
			"pending",
			"processing",
			"shipped",
			"delivered",
			"cancelled",
		];

		if (!validStatuses.includes(status)) {
			return response.json({
				success: false,
				message: `Invalid status. Valid values: ${validStatuses.join(", ")}`,
			});
		}

		const order = await Order.findByIdAndUpdate(
			orderId,
			{ status },
			{ new: true },
		);

		if (!order) {
			return response.json({
				success: false,
				message: "Order not found",
			});
		}

		console.log(`Order status updated to: ${status}`);

		response.json({
			success: true,
			message: "Order status updated",
			order,
		});
	} catch (error) {
		console.error("Error in updateOrderStatus:", error.message);
		response.json({
			success: false,
			message: error.message,
		});
	}
};

// ^ place order Online Payment : /api/order/online
export const placeOrderOnline = async (request, response) => {
	try {
		console.log("========== placeOrderOnline ==========");

		const userId = request.user.id;
		const { items, address } = request.body;

		if (!items || items.length === 0 || !address) {
			return response.json({
				success: false,
				message: "Invalid order data",
			});
		}

		// Calculate amount
		let amount = 0;
		for (const item of items) {
			const product = await Product.findById(item.product);
			if (!product) {
				return response.json({
					success: false,
					message: `Product not found: ${item.product}`,
				});
			}
			amount += product.offerPrice * item.quantity;
		}
		amount += Math.floor(amount * 0.0785);

		console.log(`Payment URL generated`);

		response.json({
			success: true,
			message: "Redirecting to payment gateway",
			url: paymentUrl,
		});
	} catch (error) {
		console.error("Error in placeOrderOnline:", error.message);
		response.json({
			success: false,
			message: error.message,
		});
	}
};
