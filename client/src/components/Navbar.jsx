import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";
import { NavLink } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { useClerk } from "@clerk/clerk-react";

const Navbar = () => {
	const { signOut } = useClerk();
	const [open, setOpen] = useState(false);

	const {
		axios,
		navigate,
		user,
		setUser,
		setShowUserLogin,
		setSearchQuery,
		searchQuery,
		getCartCount,
	} = useAppContext();

	const logout = async () => {
		try {
			// const { data } = await axios.get("/api/user/logout");
			await signOut();
			toast.success("Logged out successfully");
			setShowUserLogin(false);
			navigate("/");
			if (data.success) {
				toast.success(data.message);
				setUser(null);
				navigate("/");
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			toast.error(error.message);
		}
	};

	useEffect(() => {
		if (searchQuery.length > 0) {
			navigate("/products");
		}
	}, [searchQuery]);

	return (
		<nav className="flex items-center justify-between px-16 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-primary-forest-green bg-secondary-soft-beige text-primary-forest-green transition-all">
			<NavLink onClick={() => setOpen(false)} to={"/"}>
				<img className="h-10" src={assets.holisticAfLogo} alt="logo" />
			</NavLink>

			{/* //^ Desktop Menu */}
			<div className="hidden sm:flex items-center gap-8">
				<div className="hidden lg:flex items-center text-sm gap-2 border border-secondary-deep-forest px-3 rounded-full bg-primary-warm-white">
					<input
						onChange={(e) => setSearchQuery(e.target.value)}
						className="py-1.5 w-full bg-transparent outline-none placeholder-primary-forest-green"
						type="text"
						placeholder="search products"
					/>
					<img
						src={assets.search}
						alt="search"
						className="w-4 h-4 text-secondary-deep-forest"
					/>
				</div>

				<NavLink to={"/"}>home</NavLink>
				<NavLink to={"/products"}>products</NavLink>
				<NavLink to={"/contact"}>contact</NavLink>

				<button
					onClick={() => (window.location.href = "/admin")}
					className="text-xs border border-primary-forest-green px-2 py-1  hover:bg-primary-forest-green hover:text-white rounded-full transition"
				>
					admin
				</button>

				<div
					onClick={() => navigate("/cart")}
					className="relative cursor-pointer"
				>
					<img
						src={assets.cart}
						alt="cart"
						className="w-6 opacity-80 text-primary-sage-green"
					/>
					<button className="absolute -top-2 -right-3 text-xs text-primary-cream bg-primary-sage-green w-[18px] h-[18px] rounded-full hover:secondary-golden-honey">
						{getCartCount()}
					</button>
				</div>

				{!user ? (
					<button
						onClick={() => setShowUserLogin(true)}
						className="cursor-pointer px-8 py-2 bg-[#daa520)] text-secondary-deep-forest border border-primary-forest-green hover:bg-secondary-golden-honey hover:text-secondary-deep-forest transition rounded-full"
					>
						login
					</button>
				) : (
					<div className="relative group">
						<img
							src={assets.profile}
							className="w-10 cursor-pointer outline-secondary-soft-beige"
							alt="profile"
						/>
						<ul className="hidden group-hover:block absolute top-10 right-0 bg-secondary-soft-beige shadow border border-primary-forest-green py-2.5 w-30 rounded-md text-sm z-40">
							<li
								onClick={() => navigate("/my-orders")}
								className="p-1.5 pl-3 hover:bg-primary-sage-green/20 hover:text-primary-forest-green cursor-pointer"
							>
								my orders
							</li>
							<li
								onClick={logout}
								className="p-1.5 pl-3 hover:bg-primary-sage-green/20 hover:text-primary-forest-green cursor-pointer"
							>
								logout
							</li>
						</ul>
					</div>
				)}
			</div>

			<div className="flex items-center gap-6 sm:hidden">
				<div
					onClick={() => navigate("/cart")}
					className="relative cursor-pointer"
				>
					<img
						src={assets.cart}
						alt="cart"
						className="w-6 opacity-80"
					/>
					<button className="absolute -top-2 -right-3 text-xs text-secondary-deep-forest bg-primary-sage-green w-[18px] h-[18px] rounded-full">
						{getCartCount()}
					</button>
				</div>

				<button
					onClick={() => (open ? setOpen(false) : setOpen(true))}
					aria-label="Menu"
					className="bg-transparent border-none cursor-pointer p-0"
				>
					<img src={assets.menuGreen} alt="menu" />
				</button>
			</div>

			{open && (
				<div className="flex sm:hidden absolute top-[60px] left-0 w-full h-full bg-primary-sage-green shadow-md py-8 flex-col items-center gap-2 px-5 text-3xl z-50">
					<NavLink to={"/"} onClick={() => setOpen(false)}>
						home
					</NavLink>
					<NavLink to={"/products"} onClick={() => setOpen(false)}>
						products
					</NavLink>
					<NavLink to={"/contact"} onClick={() => setOpen(false)}>
						contact
					</NavLink>
					{user && (
						<NavLink
							to={"/my-orders"}
							onClick={() => setOpen(false)}
						>
							my orders
						</NavLink>
					)}

					{!user ? (
						<button
							onClick={() => {
								setOpen(false);
								setShowUserLogin(true);
							}}
							className="cursor-pointer px-6 py-2 mt-10 bg-primary-forest-green text-secondary-golden-honey rounded-full text-xl border-none transition hover:bg-primary-sage-green"
						>
							login
						</button>
					) : (
						<button
							onClick={() => {
								setOpen(false);
								logout();
							}}
							className="cursor-pointer px-6 py-2 mt-2 bg-primary-forest-green text-secondary-golden-honey rounded-full text-sm border-none transition hover:bg-primary-sage-green"
						>
							logout
						</button>
					)}
				</div>
			)}
		</nav>
	);
};

export default Navbar;
