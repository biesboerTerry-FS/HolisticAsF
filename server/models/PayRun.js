import mongoose from "mongoose";

// A single payroll run for one employee in one pay period.
const payRunSchema = new mongoose.Schema(
	{
		// Stable key used by the idempotent demo seeder.
		key: { type: String, trim: true, default: "" },
		employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
		employeeId: { type: String, trim: true, default: "" },
		employeeName: { type: String, required: true, trim: true },
		period: { type: String, required: true, trim: true },
		startDate: { type: String, trim: true, default: "" },
		endDate: { type: String, trim: true, default: "" },
		amount: { type: Number, required: true, min: 0 },
		status: { type: String, enum: ["paid", "pending"], default: "pending" },
		note: { type: String, trim: true, default: "" },
	},
	{ timestamps: true },
);

const PayRun = mongoose.models.PayRun || mongoose.model("PayRun", payRunSchema);

export default PayRun;
