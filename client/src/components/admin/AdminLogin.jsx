import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";

const AdminLogin = () => {
	const { isAdmin, setIsAdmin, navigate } = useAppContext();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const onSubmitHandler = (event) => {
		event.preventDefault();
		setIsAdmin(true);
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
				className="min-h-screen flex items-center text-sm text-primary-forest-green"
			>
				<div
					className="flex flex-col gap-5 m-auto items-start p-8 py-12 min-w-80 sm:min-w-88 rounded-lg shadow-xl border border-primary-forest-green bg-primary-sage-green/50
				"
				>
					<p className="text-2xl font-medium m-auto">
						admin{" "}
						<span className="text-secondary-golden-honey">
							login
						</span>
					</p>
					<div className="w-full">
						<p className="text-primary-forest-green">email</p>
						<input
							onChange={(event) => setEmail(event.target.value)}
							value={email}
							placeholder="type here"
							className="border outline-primary-cream bg-primary-cream rounded w-full p-2 mt-1 "
							type="email"
							required
						/>
					</div>
					<div className="w-full">
						<p className="text-primary-forest-green">password</p>
						<input
							onChange={(event) =>
								setPassword(event.target.value)
							}
							value={password}
							placeholder="type here"
							className="border outline-primary-cream bg-primary-cream rounded w-full p-2 mt-1 "
							type="password"
							required
						/>
					</div>
					<button className="bg-primary-forest-green text-primary-cream w-full py-2 rounded-md cursor-pointer">
						login
					</button>
				</div>
			</form>
		)
	);
};

export default AdminLogin;
