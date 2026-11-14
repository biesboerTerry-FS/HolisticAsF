import mongoose from "mongoose";

const shiftSchema = new mongoose.Schema(
	{
		employee: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Employee",
			required: true,
		},
		date: { type: String, required: true }, // YYYY-MM-DD
		startTime: { type: String, required: true }, // HH:mm
		endTime: { type: String, required: true }, // HH:mm
		role: { type: String, trim: true, default: "" },
		location: { type: String, trim: true, default: "" },
		notes: { type: String, trim: true, default: "" },
		status: {
			type: String,
			enum: ["scheduled", "completed", "cancelled"],
			default: "scheduled",
		},
	},
	{ timestamps: true },
);

shiftSchema.index({ date: 1, startTime: 1 });

const Shift = mongoose.models.Shift || mongoose.model("Shift", shiftSchema);

export default Shift;
