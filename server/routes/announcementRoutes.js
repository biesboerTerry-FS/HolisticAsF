import express from "express";
import mongoose from "mongoose";
import Announcement from "../models/Announcement.js";

const announcementRouter = express.Router();

const TYPES = ["info", "warning", "promotion"];

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// Public: only the announcements that should appear on the storefront/mobile app.
announcementRouter.get("/active", async (_request, response) => {
	try {
		const announcements = await Announcement.find({ active: true }).sort({ createdAt: -1 });
		response.json({ success: true, announcements });
	} catch (error) {
		console.error("Failed to load active announcements:", error.message);
		response.status(500).json({ success: false, message: "Failed to load announcements" });
	}
});

// Public: full list for the admin panel.
announcementRouter.get("/", async (_request, response) => {
	try {
		const announcements = await Announcement.find({}).sort({ createdAt: -1 });
		response.json({ success: true, announcements });
	} catch (error) {
		console.error("Failed to load announcements:", error.message);
		response.status(500).json({ success: false, message: "Failed to load announcements" });
	}
});

announcementRouter.post("/", async (request, response) => {
	try {
		const { title, body, type = "info", active = true } = request.body || {};

		if (!title || !String(title).trim() || !body || !String(body).trim()) {
			return response.status(400).json({
				success: false,
				message: "Title and body are required",
			});
		}

		if (!TYPES.includes(type)) {
			return response.status(400).json({
				success: false,
				message: "Type must be info, warning, or promotion",
			});
		}

		const announcement = await Announcement.create({
			title: String(title).trim(),
			body: String(body).trim(),
			type,
			active: Boolean(active),
		});

		response.status(201).json({ success: true, announcement });
	} catch (error) {
		console.error("Failed to create announcement:", error.message);
		response.status(500).json({ success: false, message: "Failed to create announcement" });
	}
});

announcementRouter.patch("/:id", async (request, response) => {
	try {
		const { id } = request.params;
		if (!isValidId(id)) {
			return response.status(400).json({ success: false, message: "Invalid announcement id" });
		}

		const { title, body, type, active } = request.body || {};
		const update = {};
		if (title !== undefined) update.title = String(title).trim();
		if (body !== undefined) update.body = String(body).trim();
		if (type !== undefined) {
			if (!TYPES.includes(type)) {
				return response.status(400).json({
					success: false,
					message: "Type must be info, warning, or promotion",
				});
			}
			update.type = type;
		}
		if (active !== undefined) update.active = Boolean(active);

		if (Object.keys(update).length === 0) {
			return response.status(400).json({ success: false, message: "No fields to update" });
		}

		const announcement = await Announcement.findByIdAndUpdate(id, update, {
			new: true,
			runValidators: true,
		});

		if (!announcement) {
			return response.status(404).json({ success: false, message: "Announcement not found" });
		}

		response.json({ success: true, announcement });
	} catch (error) {
		console.error("Failed to update announcement:", error.message);
		response.status(500).json({ success: false, message: "Failed to update announcement" });
	}
});

announcementRouter.delete("/:id", async (request, response) => {
	try {
		const { id } = request.params;
		if (!isValidId(id)) {
			return response.status(400).json({ success: false, message: "Invalid announcement id" });
		}

		const announcement = await Announcement.findByIdAndDelete(id);
		if (!announcement) {
			return response.status(404).json({ success: false, message: "Announcement not found" });
		}

		response.json({ success: true, message: "Announcement deleted" });
	} catch (error) {
		console.error("Failed to delete announcement:", error.message);
		response.status(500).json({ success: false, message: "Failed to delete announcement" });
	}
});

export default announcementRouter;
