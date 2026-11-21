import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		trim: true,
	},
	body: {
		type: String,
		required: true,
		trim: true,
	},
	type: {
		type: String,
		enum: ["info", "warning", "promotion"],
		default: "info",
	},
	active: {
		type: Boolean,
		default: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const Announcement =
	mongoose.models.Announcement ||
	mongoose.model("Announcement", announcementSchema);

export default Announcement;
