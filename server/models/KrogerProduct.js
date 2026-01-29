import mongoose from "mongoose";

const KrogerProductSchema = new mongoose.Schema({
	name: { type: String, required: true },
	description: { type: String },
	brand: { type: String },
	regularPrice: { type: Number, required: true },
	offerPrice: { type: Number, required: true },
	price: {
		regular: { type: Number },
		sale: { type: Number },
	},
	image: [{ type: String }],
	category: { type: String, required: true },
	subCategory: { type: String },
	stock: { type: Number, default: 100 },
	externalId: { type: String },
	upc: { type: String, unique: true, sparse: true },
	productId: { type: String },
	size: { type: String },
	isKrogerProduct: { type: Boolean, default: false },
	krogerProductId: { type: String },
	krogerUpc: { type: String },
	dataSource: {
		name: { type: String },
		price: { type: String },
		image: { type: String },
	},
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

const KrogerProduct =
	mongoose.models.KrogerProduct ||
	mongoose.model("KrogerProduct", KrogerProductSchema, "krogerproducts");

export default KrogerProduct;
