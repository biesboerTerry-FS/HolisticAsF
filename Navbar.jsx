import React, { useEffect, useState } from "react";
import logo from "../assets/holisticAfLogo.png";
import search from "../assets/search.svg";
import cart from "../assets/cart.svg";
import profile from "../assets/profile.svg";
import toast from "react-hot-toast";
import { NavLink } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const Navbar = () => {
	const [open, setOpen] = useState(false);

	const {
		axios,
		navigate,
		user,
		setUser,
		setShowUserLogin,
		// searchQuery,
		setSearchQuery,
	} = useAppContext();

	const logout = async () => {
		try {
			const { data } = await axios.get("/api/user/logout");
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

	// useEffect(() => {
	// 	if (searchQuery.length > 0) {
	// 		navigate("/products");
	// 	}
	// });

	return (
		<nav className="flex items-center justify-between px-16 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-[]] bg-[#f5f5dc] text-[#2d5b3e] transition-all">
			<NavLink onClick={() => setOpen(false)} to={"/"}>
				<img className="h-10" src={logo} alt="logo" />
			</NavLink>

			{/* Desktop Menu */}
			<div className="hidden sm:flex items-center gap-8">
				<div className="hidden lg:flex items-center text-sm gap-2 border border-[#1b3b28] px-3 rounded-full bg-[#fefefe]">
					<input
						onChange={(event) => setSearchQuery(event.target.value)}
						className="py-1.5 w-full bg-transparent outline-none placeholder-[#2d5b3e]"
						type="text"
						placeholder="Search products"
					/>
					<img
						src={search}
						alt="search"
						className="w-4 h-4 text-[#1b3b28]"
					/>
				</div>

				<NavLink to={"/"}>home</NavLink>
				<NavLink to={"/products"}>products</NavLink>
				<NavLink to={"/contact"}>contact</NavLink>

				<div
					onClick={() => navigate("/cart")}
					className="relative cursor-pointer"
				>
					<img
						src={cart}
						alt="cart"
						className="w-6 opacity-80 text-[#8cae8c]"
					/>
					<button className="absolute -top-2 -right-3 text-xs text-[#1b3b28] bg-[#8cae8c] w-[18px] h-[18px] rounded-full"></button>
				</div>

				{!user ? (
					<button
						onClick={() => setShowUserLogin(true)}
						className="cursor-pointer px-8 py-2 bg-[#daa520)] text-[#1b3b28] border border-[#2d5b3e] hover:bg-[#daa520] hover:text-[#1b3b28] transition rounded-full"
					>
						login
					</button>
				) : (
					<div className="relative group">
						<img
							src={profile}
							className="w-10 cursor-pointer"
							alt="profile"
						/>
						<ul className="hidden group-hover:block absolute top-10 right-0 bg-[#8cae8c] shadow border border-[#f7f5f2] py-2.5 w-30 rounded-md text-sm z-40">
							<li
								onClick={() => navigate("/my-orders")}
								className="p-1.5 pl-3 hover:bg-[#daa520] cursor-pointer"
							>
								my orders
							</li>
							<li
								onClick={logout}
								className="p-1.5 pl-3 hover:bg-[#daa520] cursor-pointer"
							>
								logout
							</li>
						</ul>
					</div>
				)}
			</div>

			{/* Mobile Menu Trigger */}
			<div className="flex items-center gap-6 sm:hidden">
				<div
					onClick={() => navigate("/cart")}
					className="relative cursor-pointer"
				>
					<img src={cart} alt="cart" className="w-6 opacity-80" />
					<button className="absolute -top-2 -right-3 text-xs text-[#1b3b28] bg-[#8cae8c] w-[18px] h-[18px] rounded-full"></button>
				</div>

				<button
					onClick={() => setOpen(!open)}
					aria-label="Menu"
					className="bg-transparent border-none cursor-pointer p-0"
				>
					<svg
						className="w-6 h-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M4 6h16M4 12h16M4 18h16"
						/>
					</svg>
				</button>
			</div>

			{/* Mobile Menu */}
			{open && (
				<div className="flex sm:hidden absolute top-[60px] left-0 w-full bg-[#8cae8c] shadow-md py-4 flex-col items-center gap-2 px-5 text-sm">
					<NavLink to={"/"} onClick={() => setOpen(false)}>
						Home
					</NavLink>
					<NavLink to={"/products"} onClick={() => setOpen(false)}>
						Products
					</NavLink>
					<NavLink to={"/contact"} onClick={() => setOpen(false)}>
						Contact
					</NavLink>
					{user && (
						<NavLink
							to={"/my-orders"}
							onClick={() => setOpen(false)}
						>
							My Orders
						</NavLink>
					)}

					{!user ? (
						<button
							onClick={() => {
								setOpen(false);
								setShowUserLogin(true);
							}}
							className="cursor-pointer px-6 py-2 mt-2 bg-[#2d5b3e] text-[#daa520] rounded-full text-sm border-none transition hover:bg-[#8cae8c]"
						>
							Login
						</button>
					) : (
						<button
							onClick={() => {
								setOpen(false);
								logout();
							}}
							className="cursor-pointer px-6 py-2 mt-2 bg-[#2d5b3e] text-[#daa520] rounded-full text-sm border-none transition hover:bg-[#8cae8c]"
						>
							Logout
						</button>
					)}
				</div>
			)}
		</nav>
	);
};

export default Navbar;
