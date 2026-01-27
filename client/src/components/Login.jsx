import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Login = () => {
	const { setShowUserLogin, setUser, axios, navigate } = useAppContext();
	const [state, setState] = useState("login");
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const onSubmitHandler = async (event) => {
		try {
			event.preventDefault();
			const { data } = await axios.post(`/api/user/${state}`, {
				name,
				email,
				password,
			});
			if (data.success) {
				navigate("/");
				setUser(data.user);
				setShowUserLogin(false);
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			toast.error(error.message);
		}
	};

	return (
		<div
			onClick={() => setShowUserLogin(false)}
			className="fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center text-sm
			bg-secondary-golden-honey/30 backdrop-blur-xl"
		>
			<form
				onSubmit={onSubmitHandler}
				onClick={(e) => e.stopPropagation()}
				className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl bg-primary-forest-green/50 "
			>
				<p className="text-2xl font-medium m-auto  text-primary-cream">
					user{" "}
					<span className="text-secondary-golden-honey">
						{state === "login" ? "login" : "sign up"}
					</span>
				</p>
				{state === "register" && (
					<div className="w-full">
						<p className="text-primary-warm-white">Name</p>
						<input
							onChange={(e) => setName(e.target.value)}
							value={name}
							placeholder="type here"
							className="border bg-primary-cream rounded w-full p-2 mt-1 "
							type="text"
							required
						/>
					</div>
				)}
				<div className="w-full ">
					<p className="text-primary-warm-white">Email</p>
					<input
						onChange={(e) => setEmail(e.target.value)}
						value={email}
						placeholder="type here"
						className="border bg-primary-cream rounded w-full p-2 mt-1 "
						type="email"
						required
					/>
				</div>
				<div className="w-full ">
					<p className="text-primary-warm-white">Password</p>
					<input
						onChange={(e) => setPassword(e.target.value)}
						value={password}
						placeholder="type here"
						className="border bg-primary-cream rounded w-full p-2 mt-1 "
						type="password"
						required
					/>
				</div>
				{state === "register" ? (
					<p className="text-primary-warm-white">
						already have account?{" "}
						<span
							onClick={() => setState("login")}
							className="cursor-pointer"
						>
							click here
						</span>
					</p>
				) : (
					<p className="text-primary-warm-white">
						create an account?{" "}
						<span
							onClick={() => setState("register")}
							className="cursor-pointer"
						>
							click here
						</span>
					</p>
				)}
				<button className="bg-secondary-golden-honey transition-all text-primary-warm-white w-full py-2 rounded-md cursor-pointer">
					{state === "register" ? "create an account" : "login"}
				</button>
			</form>
		</div>
	);
};

export default Login;
