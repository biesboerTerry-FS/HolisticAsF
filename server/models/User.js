import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		clerkId: {
			type: String,
			required: true,
			unique: true,
		},
		phone: {
			type: String,
			default: "",
		},
		role: {
			type: String,
			enum: ["user", "admin"],
			default: "user",
		},
		password: {
			type: String,
			required: false,
		},
		cartItems: {
			type: Object,
			default: {},
		},
		orders: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Order",
			},
		],
		addresses: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Address",
			},
		],
	},
	{ minimize: false },
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
