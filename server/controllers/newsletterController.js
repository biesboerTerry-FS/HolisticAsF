import Newsletter from "../models/Newsletter.js";

const subscribeToNewsletter = async (req, res) => {
	try {
		const { email } = req.body;

		if (!email) {
			return res
				.status(400)
				.json({ success: false, message: "Email is required" });
		}

		const exists = await Newsletter.findOne({ email });
		if (exists) {
			return res.status(400).json({
				success: false,
				message: "You are already subscribed!",
			});
		}

		const newSubscriber = new Newsletter({ email });
		await newSubscriber.save();

		res.status(201).json({
			success: true,
			message: "Subscribed successfully!",
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Server error, please try again later",
		});
	}
};

export { subscribeToNewsletter };
