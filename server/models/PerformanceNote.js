import mongoose from "mongoose";

// A manager's written performance note for an employee.
const performanceNoteSchema = new mongoose.Schema(
	{
		// Stable key used by the idempotent demo seeder.
		key: { type: String, trim: true, default: "" },
		employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
		employeeName: { type: String, trim: true, default: "" },
		author: { type: String, required: true, trim: true },
		date: { type: String, trim: true, default: "" },
		text: { type: String, required: true, trim: true },
	},
	{ timestamps: true },
);

const PerformanceNote =
	mongoose.models.PerformanceNote || mongoose.model("PerformanceNote", performanceNoteSchema);

export default PerformanceNote;
