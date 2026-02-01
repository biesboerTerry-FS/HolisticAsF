import Contact from "../models/Contact.js";

// ^ submit contact form: /api/contact/submit
export const submitContact = async (request, response) => {
	try {
		const { name, email, subject, message } = request.body;

		console.log("========== submitContact ==========");
		console.log("Name:", name);
		console.log("Email:", email);
		console.log("Subject:", subject);

		if (!name || !email || !subject || !message) {
			return response.json({
				success: false,
				message: "All fields are required",
			});
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return response.json({
				success: false,
				message: "Please enter a valid email address",
			});
		}

		const contact = await Contact.create({
			name,
			email,
			subject,
			message,
			status: "new",
		});

		console.log("Contact message saved with ID:", contact._id);

		return response.json({
			success: true,
			message: "Thank you for your message! We'll get back to you soon.",
			contactId: contact._id,
		});
	} catch (error) {
		console.error("Error in submitContact:", error.message);
		return response.json({
			success: false,
			message: "Failed to submit contact form",
			error:
				process.env.NODE_ENV === "development"
					? error.message
					: undefined,
		});
	}
};

// ^ get all contact messages (admin): /api/contact/admin
export const getContactMessages = async (request, response) => {
	try {
		console.log("========== getContactMessages (Admin) ==========");

		// Pagination
		const page = parseInt(request.query.page) || 1;
		const limit = parseInt(request.query.limit) || 10;
		const skip = (page - 1) * limit;

		const messages = await Contact.find({})
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit);

		const total = await Contact.countDocuments();

		console.log(`✅ Found ${messages.length} messages (Total: ${total})`);

		return response.json({
			success: true,
			messages,
			pagination: {
				total,
				pages: Math.ceil(total / limit),
				current: page,
				limit,
			},
		});
	} catch (error) {
		console.error("❌ Error in getContactMessages:", error.message);
		return response.json({
			success: false,
			message: "Failed to retrieve contact messages",
		});
	}
};

// ^ get unread contact messages (admin): /api/contact/unread
export const getUnreadMessages = async (request, response) => {
	try {
		console.log("========== getUnreadMessages (Admin) ==========");

		const messages = await Contact.find({ status: "new" }).sort({
			createdAt: -1,
		});

		console.log(`✅ Found ${messages.length} unread messages`);

		return response.json({
			success: true,
			messages,
			count: messages.length,
		});
	} catch (error) {
		console.error("❌ Error in getUnreadMessages:", error.message);
		return response.json({
			success: false,
			message: "Failed to retrieve unread messages",
		});
	}
};

// ^ update message status: /api/contact/:id
export const updateMessageStatus = async (request, response) => {
	try {
		const { id } = request.params;
		const { status } = request.body;

		console.log("========== updateMessageStatus ==========");
		console.log("Message ID:", id);
		console.log("New Status:", status);

		if (!["new", "read", "replied"].includes(status)) {
			return response.json({
				success: false,
				message: "Invalid status",
			});
		}

		const message = await Contact.findByIdAndUpdate(
			id,
			{ status },
			{ new: true },
		);

		if (!message) {
			return response.json({
				success: false,
				message: "Message not found",
			});
		}

		console.log("✅ Message status updated to:", status);

		return response.json({
			success: true,
			message: "Message status updated",
			data: message,
		});
	} catch (error) {
		console.error("❌ Error in updateMessageStatus:", error.message);
		return response.json({
			success: false,
			message: "Failed to update message status",
		});
	}
};

// ^ delete contact message: /api/contact/:id
export const deleteContactMessage = async (request, response) => {
	try {
		const { id } = request.params;

		console.log("========== deleteContactMessage ==========");
		console.log("Message ID:", id);

		const message = await Contact.findByIdAndDelete(id);

		if (!message) {
			return response.json({
				success: false,
				message: "Message not found",
			});
		}

		console.log("✅ Message deleted:", id);

		return response.json({
			success: true,
			message: "Message deleted successfully",
		});
	} catch (error) {
		console.error("❌ Error in deleteContactMessage:", error.message);
		return response.json({
			success: false,
			message: "Failed to delete message",
		});
	}
};
