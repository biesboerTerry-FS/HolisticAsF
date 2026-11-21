import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, trim: true },
		// Stable identifier for the self-service demo employee.
		employeeId: { type: String, trim: true, default: "" },
		email: { type: String, trim: true, lowercase: true, default: "" },
		phone: { type: String, trim: true, default: "" },
		address: { type: String, trim: true, default: "" },
		position: { type: String, trim: true, default: "Staff" },
		// HR directory fields. Defaults preserve the existing employee portal.
		department: { type: String, trim: true, default: "Sales floor" },
		rate: { type: Number, default: 0 },
		payType: { type: String, enum: ["hourly", "salary"], default: "hourly" },
		color: { type: String, trim: true, default: "#1e4d43" },
		active: { type: Boolean, default: true },
		notes: { type: String, trim: true, default: "" },
	},
	{ timestamps: true },
);

const Employee = mongoose.models.Employee || mongoose.model("Employee", employeeSchema);

export default Employee;
