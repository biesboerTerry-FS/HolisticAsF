import mongoose from "mongoose";

// Small keyed document holding the HR department/role catalog.
const hrSettingSchema = new mongoose.Schema(
	{
		key: { type: String, required: true, unique: true, trim: true },
		departments: { type: [String], default: [] },
		roles: { type: [String], default: [] },
	},
	{ timestamps: true },
);

const HrSetting = mongoose.models.HrSetting || mongoose.model("HrSetting", hrSettingSchema);

export default HrSetting;
