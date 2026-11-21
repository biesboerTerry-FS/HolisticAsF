import mongoose from "mongoose";

// A shipping address keeps both the modern "label/line1/zip" field names used by
// the profile page and the legacy "firstName/streetLine1/zipCode" names used by
// checkout. The controller normalizes between them on every write.
const addressSchema = new mongoose.Schema(
	{
		userId: { type: String, required: true, index: true },
		label: { type: String, default: "Shipping" },

		line1: { type: String, required: true },
		line2: { type: String, default: "" },
		city: { type: String, required: true },
		state: { type: String, required: true },
		zip: { type: String, required: true },
		country: { type: String, default: "US" },

		// Legacy checkout fields (kept in sync by the controller).
		firstName: { type: String, default: "" },
		lastName: { type: String, default: "" },
		streetLine1: { type: String, default: "" },
		streetLine2: { type: String, default: "" },
		zipCode: { type: String, default: "" },
		phone: { type: String, default: "" },
		email: { type: String, default: "" },

		isDefault: { type: Boolean, default: false },
	},
	{ timestamps: true, minimize: false },
);

const Address =
	mongoose.models.Address || mongoose.model("Address", addressSchema);

export default Address;
