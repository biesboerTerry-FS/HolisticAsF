import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
	userId: { type: String, required: true },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	streetLine1: { type: String, required: true },
	streetLine2: { type: String },
	city: { type: String, required: true },
	state: { type: String, required: true },
	zipCode: { type: String, required: true },
	phone: { type: String, required: true },
	email: { type: String, required: true },
});

const Address =
	mongoose.models.Address || mongoose.model("Address", addressSchema);

export default Address;
