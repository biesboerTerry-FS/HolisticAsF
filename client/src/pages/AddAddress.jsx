import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const InputField = ({
	type,
	placeholder,
	name,
	handleChange,
	address = {},
	required = true,
}) => (
	<input
		className="w-full px-2 py-2.5 border border-primary-forest-green/30 rounded outline-none text-primary-forest-green focus:border-primary-forest-green transition"
		type={type}
		placeholder={placeholder}
		onChange={handleChange}
		name={name}
		value={address?.[name] || ""}
		required={required}
	/>
);

const AddAddress = () => {
	const { axios, navigate, user } = useAppContext();

	const [address, setAddress] = useState({
		firstName: "",
		lastName: "",
		email: "",
		streetLine1: "",
		streetLine2: "",
		city: "",
		state: "",
		zipCode: "",
		phone: "",
	});

	const [isLoading, setIsLoading] = useState(false);

	const handleChange = (event) => {
		const { name, value } = event.target;

		setAddress((prevAddress) => ({
			...prevAddress,
			[name]: value,
		}));
	};

	const onSubmitHandler = async (event) => {
		event.preventDefault();

		// ^ ------------------------------------------------------
		console.log("=== Address Form Submission ===");
		console.log("user from context:", user);
		console.log("user._id:", user?.id);
		console.log("address data:", address);

		if (!user || !user.id) {
			toast.error("user not logged in. please sign in.");
			navigate("/login");
			return;
		}
		// ^ ------------------------------------------------------

		console.log("User is available, proceeding...");
		try {
			setIsLoading(true);

			const { data } = await axios.post(
				"/api/address/add-address",
				address,
			);

			// ^ ------------------------------------------------------
			console.log("API Response:", data);

			if (data.success) {
				toast.success(data.message);
				setAddress({
					firstName: "",
					lastName: "",
					email: "",
					streetLine1: "",
					streetLine2: "",
					city: "",
					state: "",
					zipCode: "",
					phone: "",
				});
				setTimeout(() => {
					navigate("/cart");
				}, 500);
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			console.error("API Error:", error);
			toast.error(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (!user) {
			navigate("/cart");
		}
	}, [user, navigate]);

	if (!user) {
		return null;
	}

	return (
		<div className="mt-16 pb-16">
			<p className="text-2xl md:text-3xl text-primary-forest-green">
				add{" "}
				<span className="font-semibold text-secondary-golden-honey">
					address
				</span>
			</p>
			<div className="flex flex-col-reverse md:flex-row justify-between mt-10">
				<div className="flex-1 max-w-md">
					<form
						className="space-y-3 mt-6 text-sm"
						onSubmit={onSubmitHandler}
					>
						<div className="grid grid-cols-2 gap-4">
							<InputField
								handleChange={handleChange}
								address={address}
								name="firstName"
								type="text"
								placeholder="first name"
								required={true}
							/>
							<InputField
								handleChange={handleChange}
								address={address}
								name="lastName"
								type="text"
								placeholder="last name"
								required={true}
							/>
						</div>
						<InputField
							handleChange={handleChange}
							address={address}
							name="streetLine1"
							type="text"
							placeholder="street line 1"
							required={true}
						/>
						<InputField
							handleChange={handleChange}
							address={address}
							name="streetLine2"
							type="text"
							placeholder="street line 2"
							required={false}
						/>
						<div>
							<InputField
								handleChange={handleChange}
								address={address}
								name="city"
								type="text"
								placeholder="city"
								required={true}
							/>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<InputField
								handleChange={handleChange}
								address={address}
								name="state"
								type="text"
								placeholder="state"
								required={true}
							/>
							<InputField
								handleChange={handleChange}
								address={address}
								name="zipCode"
								type="text"
								placeholder="zip/postal code"
								required={true}
							/>
						</div>
						<InputField
							handleChange={handleChange}
							address={address}
							name="phone"
							type="text"
							placeholder="phone"
							required={true}
						/>
						<InputField
							handleChange={handleChange}
							address={address}
							name="email"
							type="email"
							placeholder="email"
							required={true}
						/>
						<button
							type="submit"
							disabled={!user}
							title={!user ? "Login to add address" : ""}
							className="w-full mt-6 bg-primary-forest-green text-white py-3 hover:bg-primary-forest-green-dull transition cursor-pointer"
						>
							{isLoading ? "saving address..." : "save address"}
						</button>
					</form>
				</div>
				<img
					className="md:mr-16 mb-16 md:mt-0"
					src={assets.addAddressImage}
					alt="add address"
				/>
			</div>
		</div>
	);
};

export default AddAddress;
