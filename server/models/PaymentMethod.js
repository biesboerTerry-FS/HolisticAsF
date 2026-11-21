import mongoose from "mongoose";

// Demo-only payment metadata. This collection deliberately has NO slot for a
// full card number / CVC — only brand, last four digits and expiry. No Stripe
// calls are made by these routes (checkout keeps its own test-mode flow).
const paymentMethodSchema = new mongoose.Schema(
	{
		userId: { type: String, required: true, index: true },
		brand: { type: String, default: "Test card" },
		last4: { type: String, required: true },
		exp: { type: String, default: "" },
		label: { type: String, default: "Test card" },
		isDefault: { type: Boolean, default: false },
		demo: { type: Boolean, default: true },
	},
	{ timestamps: true },
);

const PaymentMethod =
	mongoose.models.PaymentMethod ||
	mongoose.model("PaymentMethod", paymentMethodSchema);

export default PaymentMethod;
