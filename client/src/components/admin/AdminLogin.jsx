import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AdminLogin = () => {
	const { isAdmin, setIsAdmin, navigate, axios } = useAppContext();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const onSubmitHandler = async (event) => {
		try {
			event.preventDefault();
			const { data } = await axios.post("/api/admin/login", {
				email,
				password,
			});
			if (data.success) {
				setIsAdmin(true);
				navigate("/admin");
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			toast.error(error.message);
		}
	};

	useEffect(() => {
		if (isAdmin) {
			navigate("/admin");
		}
	}, [isAdmin]);

	return (
		!isAdmin && (
			<form
				onSubmit={onSubmitHandler}
				className="min-h-screen flex items-center justify-center bg-secondary-soft-beige px-4 text-sm text-primary-forest-green"
			>
				<div className="flex flex-col gap-5 w-full max-w-sm items-start p-8 rounded-lg shadow-xl border border-primary-forest-green/30 bg-primary-warm-white">
					<p className="text-3xl font-bold text-secondary-golden-honey">
						holisticAF
					</p>
					<p className="text-2xl font-medium">
						admin{" "}
						<span className="text-secondary-golden-honey">
							login
						</span>
					</p>
					<div className="w-full">
						<label
							htmlFor="admin-email"
							className="text-primary-forest-green"
						>
							email
						</label>
						<input
							id="admin-email"
							onChange={(event) => setEmail(event.target.value)}
							value={email}
							placeholder="you@example.com"
							className="border border-primary-forest-green/40 outline-primary-sage-green bg-primary-cream rounded w-full p-2 mt-1 focus:border-primary-forest-green"
							type="email"
							autoComplete="username"
							required
						/>
					</div>
					<div className="w-full">
						<label
							htmlFor="admin-password"
							className="text-primary-forest-green"
						>
							password
						</label>
						<input
							id="admin-password"
							onChange={(event) =>
								setPassword(event.target.value)
							}
							value={password}
							placeholder="enter your password"
							className="border border-primary-forest-green/40 outline-primary-sage-green bg-primary-cream rounded w-full p-2 mt-1 focus:border-primary-forest-green"
							type="password"
							autoComplete="current-password"
							required
						/>
					</div>
					<button className="bg-primary-forest-green text-primary-cream w-full py-2 rounded-md cursor-pointer transition hover:bg-secondary-deep-forest focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-golden-honey">
						login
					</button>
				</div>
			</form>
		)
	);
};

export default AdminLogin;
