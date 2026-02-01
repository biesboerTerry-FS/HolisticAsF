import React, { useState } from "react";
import { Mail, Phone, Send } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Contact = () => {
	const { axios } = useAppContext();
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		subject: "",
		message: "",
	});

	const [submitted, setSubmitted] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Validate form data
		if (
			!formData.name ||
			!formData.email ||
			!formData.subject ||
			!formData.message
		) {
			toast.error("Please fill in all fields");
			return;
		}

		// Validate email
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(formData.email)) {
			toast.error("Please enter a valid email address");
			return;
		}

		setIsLoading(true);

		try {
			console.log("Submitting contact form:", formData);

			const { data } = await axios.post("/api/contact/submit", formData);

			console.log("Response:", data);

			if (data.success) {
				toast.success(data.message || "Message sent successfully!");
				setFormData({ name: "", email: "", subject: "", message: "" });
				setSubmitted(true);
				setTimeout(() => setSubmitted(false), 3000);
			} else {
				toast.error(data.message || "Failed to send message");
			}
		} catch (error) {
			console.error("Error submitting contact form:", error);
			toast.error(
				error.response?.data?.message ||
					error.message ||
					"Failed to send message",
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="mt-16 flex flex-col flex-auto">
			<div className="flex flex-col flex-auto items-end w-max">
				<p className="text-secondary-golden-honey text-2xl font-medium">
					get in{" "}
					<span className="text-primary-forest-green">touch</span>
				</p>
				<div className="w-16 h-0.5 bg-primary-sage-green rounded-full"></div>
			</div>

			<div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
				<div className="flex flex-col gap-8">
					<div className="flex flex-col gap-4">
						<h3 className="text-xl font-medium text-primary-forest-green">
							contact information
						</h3>
						<p className="text-gray-600">
							have a question? we'd love to hear from you. get in
							touch with us using any of the methods below.
						</p>
					</div>

					<div className="flex items-start gap-4">
						<div className="flex items-center justify-center w-12 h-12 bg-primary-sage-green rounded-full flex-shrink-0">
							<Phone
								size={20}
								className="text-primary-forest-green"
							/>
						</div>
						<div className="flex flex-col gap-2">
							<p className="font-medium text-primary-forest-green">
								call Us
							</p>
							<a
								href="tel:+3147231421"
								className="text-gray-600 hover:text-primary-forest-green transition"
							>
								+1 (314) 723-1421
							</a>
							<p className="text-sm text-gray-500">
								monday to friday, 9am - 6pm
							</p>
						</div>
					</div>

					<div className="flex items-start gap-4">
						<div className="flex items-center justify-center w-12 h-12 bg-primary-sage-green rounded-full flex-shrink-0">
							<Mail
								size={20}
								className="text-primary-forest-green"
							/>
						</div>
						<div className="flex flex-col gap-2">
							<p className="font-medium text-primary-forest-green">
								email Us
							</p>
							<a
								href="mailto:thatdevterry@gmail.com"
								className="text-gray-600 hover:text-primary-forest-green transition"
							>
								thatdevterry@gmail.com
							</a>
							<p className="text-sm text-gray-500">
								we'll respond within 24 hours
							</p>
						</div>
					</div>
				</div>

				<div className="bg-primary-cream border border-primary-forest-green p-8 rounded-lg">
					<h3 className="text-xl font-medium text-primary-forest-green mb-6">
						send us a message
					</h3>

					{submitted && (
						<div className="mb-6 p-4 bg-primary-sage-green text-primary-forest-green rounded-lg">
							✅ Thank you! Your message has been sent
							successfully. We'll get back to you within 24 hours.
						</div>
					)}

					<form
						onSubmit={handleSubmit}
						className="flex flex-col gap-4"
					>
						<div>
							<label className="block text-sm font-medium text-primary-forest-green mb-2">
								full name
							</label>
							<input
								type="text"
								name="name"
								value={formData.name}
								onChange={handleChange}
								required
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-sage-green"
								placeholder="your name"
								disabled={isLoading}
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-primary-forest-green mb-2">
								email address
							</label>
							<input
								type="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
								required
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-sage-green"
								placeholder="john@example.com"
								disabled={isLoading}
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-primary-forest-green mb-2">
								subject
							</label>
							<input
								type="text"
								name="subject"
								value={formData.subject}
								onChange={handleChange}
								required
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-sage-green"
								placeholder="how can we help?"
								disabled={isLoading}
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-primary-forest-green mb-2">
								message
							</label>
							<textarea
								name="message"
								value={formData.message}
								onChange={handleChange}
								required
								rows="5"
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-sage-green resize-none"
								placeholder="your message here..."
								disabled={isLoading}
							></textarea>
						</div>

						<button
							type="submit"
							disabled={isLoading}
							className="flex items-center justify-center gap-2 w-full bg-primary-forest-green hover:bg-primary-sage-green text-white font-medium py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<Send size={18} />
							{isLoading ? "sending..." : "send message"}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Contact;
