import mongoose from "mongoose";

// Server-side mirror of the time-off requests submitted in the portals.
// The portal also keeps a local copy so the employee sees decisions instantly.
const timeOffRequestSchema = new mongoose.Schema(
	{
		requestId: { type: String, required: true, unique: true, trim: true },
		employeeId: { type: String, trim: true, default: "" },
		employeeName: { type: String, trim: true, default: "" },
		startDate: { type: String, trim: true, default: "" },
		endDate: { type: String, trim: true, default: "" },
		reason: { type: String, trim: true, default: "" },
		status: { type: String, enum: ["pending", "approved", "denied"], default: "pending" },
		decisionNote: { type: String, trim: true, default: "" },
		decidedAt: { type: String, trim: true, default: "" },
	},
	{ timestamps: true },
);

const TimeOffRequest =
	mongoose.models.TimeOffRequest || mongoose.model("TimeOffRequest", timeOffRequestSchema);

export default TimeOffRequest;
