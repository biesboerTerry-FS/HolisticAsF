import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
	// {
	// 	name: {
	// 		type: String,
	// 		required: true,
	// 	},
	// 	description: {
	// 		type: Array,
	// 		required: true,
	// 	},
	// 	price: {
	// 		type: Number,
	// 		required: true,
	// 	},
	// 	offerPrice: {
	// 		type: Number,
	// 		required: true,
	// 	},
	// 	image: {
	// 		type: Array,
	// 		required: true,
	// 	},
	// 	category: {
	// 		type: String,
	// 		required: true,
	// 	},
	// 	inStock: {
	// 		type: Boolean,
	// 		default: true,
	// 	},
	// },
	// { timestamps: true },

	// ^ ------- updated model for kroger
	{
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
		},
		brand: {
			type: String,
		},
		regularPrice: {
			type: Number,
			required: true,
		},
		offerPrice: {
			type: Number,
			required: true,
		},
		image: [
			{
				type: String,
			},
		],
		category: {
			type: String,
			required: true,
		},
		subCategory: {
			type: String,
		},
		stock: {
			type: Number,
			default: 100,
		},
		inStock: {
			type: Boolean,
			default: true,
		},
		source: {
			type: String,
			enum: ["mongodb", "kroger"],
			default: "mongodb",
		},
		externalId: {
			type: String,
		},
		upc: {
			type: String,
		},
		size: {
			type: String,
		},
		isKrogerProduct: {
			type: Boolean,
			default: false,
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
		updatedAt: {
			type: Date,
			default: Date.now,
		},
	},
);

const Product =
	mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
