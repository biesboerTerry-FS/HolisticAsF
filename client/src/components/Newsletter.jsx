import { useState } from "react";
import toast from "react-hot-toast";

const Newsletter = () => {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);

	const onChangeHandler = (e) => {
		setEmail(e.target.value);
	};

	const onSubmitHandler = async (e) => {
		e.preventDefault();

		if (!email.trim()) {
			toast.error("Please enter your email address");
			return;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			toast.error("Please enter a valid email address");
			return;
		}

		setLoading(true);

		try {
			const response = await fetch(
				`${import.meta.env.VITE_BACKEND_URL}/api/newsletter/subscribe`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email: email.trim() }),
				},
			);

			const data = await response.json();

			if (!response.ok) {
				if (response.status === 400) {
					toast.error(
						data.message || "This email is already subscribed",
					);
				} else {
					toast.error(data.message || "Failed to subscribe");
				}
				return;
			}

			toast.success(
				"Successfully subscribed! Check your email for confirmation.",
			);
			setEmail("");
		} catch (error) {
			console.error("Newsletter subscription error:", error);
			toast.error("An error occurred. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<section className="flex flex-col items-center justify-center text-center space-y-2 mt-24 pb-14">
			<h2 className="md:text-4xl text-2xl font-semibold text-primary-forest-green">
				stay in the know
			</h2>
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
					className="md:px-12 px-8 h-full bg-primary-forest-green hover:bg-secondary-deep-forest text-primary-warm-white transition-all cursor-pointer rounded-md rounded-l-none disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{loading ? "subscribing..." : "subscribe"}
				</button>
			</form>
		</section>
	);
};

export default Newsletter;
