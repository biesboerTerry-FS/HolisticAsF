import Product from "../models/Product.js";
import KrogerProduct from "../models/KrogerProduct.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Stripe from "stripe";

let stripeClient;
const getStripe = () => {
	if (!stripeClient) {
		stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
	}
	return stripeClient;
};

// ^ place order cod: /api/order/cod
export const placeOrderCOD = async (request, response) => {
	try {
		console.log("========== placeOrderCOD ==========");
		const userId = request.user.id;
		const { items, address } = request.body;

		console.log("userId:", userId);
		console.log("items count:", items.length);
		console.log("address:", address);

		if (!address || items.length === 0) {
			return response.json({
				success: false,
				message: "Invalid data: missing address or items",
			});
		}

		const processedItems = [];
		let amount = 0;

		for (const item of items) {
			console.log(`\nProcessing item:`, {
				productId: item.productId,
				productSource: item.productSource,
				quantity: item.quantity,
			});

			let product = null;
			let itemPrice = 0;
			let itemName = "Unknown Product";

			if (item.productSource === "kroger") {
				console.log(
					`Looking up Kroger product with UPC: ${item.productId}`,
				);
				product = await KrogerProduct.findOne({
					upc: item.productId,
				});
				if (product) {
					itemPrice = product.offerPrice || product.price || 0;
					itemName =
						product.name || product.description || "Kroger Product";
					console.log(
						`Kroger product found: ${itemName}, Price: ${itemPrice}`,
					);
				} else {
					console.warn(
						`Kroger product not found for UPC: ${item.productId}`,
					);
					itemPrice = 0;
					itemName = "Kroger Product (Not Found)";
				}
			} else {
				console.log(
					`Looking up local product with ObjectId: ${item.productId}`,
				);
				try {
					product = await Product.findById(item.productId);

					if (product) {
						itemPrice = product.offerPrice || product.price || 0;
						itemName = product.name || "Local Product";
						console.log(
							`Local product found: ${itemName}, Price: ${itemPrice}`,
						);
					} else {
						console.warn(
							`Local product not found: ${item.productId}`,
						);
						return response.json({
							success: false,
							message: `Product not found: ${item.productId}`,
						});
					}
				} catch (err) {
					console.error(
						`Invalid product ID format: ${item.productId}`,
						err.message,
					);
					return response.json({
						success: false,
						message: `Invalid product ID: ${item.productId}`,
					});
				}
			}

			const itemTotal = itemPrice * item.quantity;
			amount += itemTotal;

			console.log(
				`Item subtotal: ${itemPrice} × ${item.quantity} = ${itemTotal}`,
			);

			processedItems.push({
				product: item.productId,
				productSource: item.productSource,
				quantity: item.quantity,
				price: itemPrice,
				name: itemName,
			});
		}

		const tax = Math.floor(amount * 0.0785);
		const totalAmount = amount + tax;

		console.log(`\nOrder Summary:`);
		console.log(`Subtotal: ${amount}`);
		console.log(`Tax (7.85%): ${tax}`);
		console.log(`Total: ${totalAmount}`);

		const order = await Order.create({
			userId,
			items: processedItems,
			amount: totalAmount,
			address,
			paymentType: "cod",
			status: "pending",
		});

		console.log("✅ Order created with ID:", order._id);

		const updatedUser = await User.findByIdAndUpdate(
			userId,
			{ $push: { orders: order._id } },
			{ new: true },
		);

		console.log(
			`Order linked to user. Total orders: ${updatedUser.orders.length}`,
		);

		return response.json({
			success: true,
			message: "Order placed successfully",
			orderId: order._id,
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
		const orders = await Order.find({})
			.populate({
				path: "address",
				model: "Address",
			})
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

// ^ place order with Stripe Checkout (test mode): /api/order/payment
export const placeOrderStripe = async (request, response) => {
	try {
		const userId = request.user.id;
		const { items, address } = request.body;

		if (!address || !Array.isArray(items) || items.length === 0) {
			return response.json({
				success: false,
				message: "Invalid data: missing address or items",
			});
		}

		const lineItems = [];
		const processedItems = [];
		let amount = 0;

		for (const item of items) {
			let price = Number(item.price) || 0;
			let name = item.name || "Holistic product";

			if (item.productSource === "kroger") {
				const product = await KrogerProduct.findOne({ upc: item.productId });
				price = product?.offerPrice || product?.price || price;
				name = product?.name || name;
			} else if (String(item.productId).match(/^[a-f\d]{24}$/i)) {
				const product = await Product.findById(item.productId);
				price = product?.offerPrice || product?.price || price;
				name = product?.name || name;
			}

			const unitAmount = Math.max(0, Math.round(price * 100));
			if (!unitAmount) continue;

			amount += unitAmount * item.quantity;
			lineItems.push({
				price_data: {
					currency: "usd",
					product_data: { name },
					unit_amount: unitAmount,
				},
				quantity: item.quantity,
			});
			processedItems.push({
				product: item.productId,
				productSource: item.productSource,
				quantity: item.quantity,
				price,
				name,
			});
		}

		if (!lineItems.length) {
			return response.json({
				success: false,
				message: "No payable items in the cart",
			});
		}

		const order = await Order.create({
			userId,
			items: processedItems,
			amount: Math.round((amount / 100) * 100) / 100,
			address,
			paymentType: "stripe",
			status: "pending",
		});

		const origin =
			process.env.CORS_ORIGIN?.split(",")[0]?.trim() ||
			request.headers.origin ||
			"http://localhost:5173";

		const session = await getStripe().checkout.sessions.create({
			mode: "payment",
			line_items: lineItems,
			success_url: `${origin}/my-orders?payment=success`,
			cancel_url: `${origin}/cart?payment=cancelled`,
			metadata: { orderId: String(order._id) },
		});

		return response.json({ success: true, url: session.url });
	} catch (error) {
		console.error("Stripe checkout error:", error.message);
		return response.json({ success: false, message: error.message });
	}
};

const FULFILLMENT_STATUSES = new Set([
	"pending",
	"preparing",
	"ready",
	"completed",
	"delivered",
	"processing",
	"shipped",
	"cancelled",
]);

// ^ update order status by id (admin or employee): PATCH /api/order/:id/status
export const updateOrderStatusById = async (request, response) => {
	try {
		const { id } = request.params;
		const { status } = request.body || {};
		if (!FULFILLMENT_STATUSES.has(status)) {
			return response
				.status(400)
				.json({ success: false, message: "Invalid order status." });
		}

		const order = await Order.findByIdAndUpdate(
			id,
			{ status },
			{ new: true, runValidators: true },
		);
		if (!order) {
			return response
				.status(404)
				.json({ success: false, message: "Order not found." });
		}
		return response.json({
			success: true,
			message: "Status updated",
			order,
		});
	} catch (error) {
		return response.json({ success: false, message: error.message });
	}
};

// ^ update order status : /api/order/:orderId
export const updateOrderStatus = async (request, response) => {
	try {
		const { orderId, status } = request.body;

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

		response.json({ success: true, message: "Status updated", order });
	} catch (error) {
		response.json({ success: false, message: error.message });
	}
};
