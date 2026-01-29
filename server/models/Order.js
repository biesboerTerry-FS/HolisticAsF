import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
	{
		userId: {
			type: String,
			required: true,
			ref: "User",
		},
		items: [
			{
				product: {
					type: mongoose.Schema.Types.ObjectId,
					required: true,
					ref: "Product",
				},
				quantity: {
					type: Number,
					required: true,
				},
			},
		],
		amount: {
			type: Number,
			required: true,
		},
		address: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "Address",
		},
		status: {
			type: String,
			default: "order placed",
		},
		paymentType: {
			type: String,
			required: true,
		},
		isPaid: {
			type: Boolean,
			required: true,
			default: false,
		},
		status: {
			type: String,
			enum: [
				"pending",
				"processing",
				"shipped",
				"delivered",
				"cancelled",
			],
			default: "pending",
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
	},
	{ timestamps: true },
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
