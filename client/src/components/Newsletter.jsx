import { useState } from "react";
import toast from "react-hot-toast";

const Newsletter = () => {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);

	// Handle email input change
	const onChangeHandler = (e) => {
		setEmail(e.target.value);
	};

	// Handle form submission
	const onSubmitHandler = async (e) => {
		e.preventDefault();

		// Validate email
		if (!email.trim()) {
			toast.error("Please enter your email address");
			return;
		}

		// Basic email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			toast.error("Please enter a valid email address");
			return;
		}

		setLoading(true);

		try {
			// API call to backend to save email to MongoDB
			const response = await fetch(
				`${import.meta.env.VITE_BACKEND_URL}/api/newsletter/subscribe`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email: email.trim().toLowerCase() }),
				}
			);

			const data = await response.json();

			if (!response.ok) {
				// Handle duplicate email or other errors
				if (response.status === 400) {
					toast.error(
						data.message || "This email is already subscribed"
					);
				} else {
					toast.error(data.message || "Failed to subscribe");
				}
				return;
			}

			// Success
			toast.success(
				"Successfully subscribed! Check your email for confirmation."
			);
			setEmail(""); // Clear input field
		} catch (error) {
			console.error("Newsletter subscription error:", error);
			toast.error("An error occurred. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center text-center space-y-2 mt-24 pb-14">
			<h1 className="md:text-4xl text-2xl font-semibold text-primary-forest-green">
				stay in the know
			</h1>
			<p className="md:text-lg text-primary-forest-green pb-8">
				subscribe to get the latest offers, new arrivals, and exclusive
				discounts
			</p>
			<form
				onSubmit={onSubmitHandler}
				className="flex items-center justify-between max-w-2xl w-full md:h-13 h-12"
			>
				<input
					className="border border-secondary-deep-forest bg-primary-warm-white text-primary-forest-green rounded-md h-full outline-none w-full rounded-r-none px-3 placeholder-primary-forest-green/50"
					type="email"
					placeholder="Enter your email"
					value={email}
					onChange={onChangeHandler}
					required
					disabled={loading}
				/>
				<button
					type="submit"
					disabled={loading}
					className="md:px-12 px-8 h-full bg-primary-sage-green hover:bg-primary-forest-green text-primary-warm-white transition-all cursor-pointer rounded-md rounded-l-none disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{loading ? "subscribing..." : "subscribe"}
				</button>
			</form>
		</div>
	);
};

export default Newsletter;

// const Newsletter = () => {
// 	return (
// 		<div className="flex flex-col items-center justify-center text-center space-y-2 mt-24 pb-14">
// 			<h1 className="md:text-4xl text-2xl font-semibold text-primary-forest-green">
// 				stay in the know
// 			</h1>
// 			<p className="md:text-lg text-primary-forest-green pb-8">
// 				subscribe to get the latest offers, new arrivals, and exclusive
// 				discounts
// 			</p>
// 			<form className="flex items-center justify-between max-w-2xl w-full md:h-13 h-12">
// 				<input
// 					className="border border-secondary-deep-forest bg-primary-warm-white text-primary-forest-green rounded-md h-full outline-none w-full rounded-r-none px-3"
// 					type="text"
// 					placeholder="Enter your email"
// 					required
// 				/>
// 				<button
// 					type="submit"
// 					className="md:px-12 px-8 h-full bg-primary-sage-green hover:bg-primary-forest-green text-primary-warm-white transition-all cursor-pointer rounded-md rounded-l-none"
// 				>
// 					subscribe
// 				</button>
// 			</form>
// 		</div>
// 	);
// };

// export default Newsletter;
