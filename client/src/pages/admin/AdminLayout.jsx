import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AdminLayout = () => {
	const { axios, navigate } = useAppContext();

	const sidebarLinks = [
		{
			name: "add inventory",
			path: "/admin/add-inventory",
			icon: assets.addIcon,
		},
		{
			name: "inventory",
			path: "/admin/inventory",
			icon: assets.list,
		},
		{
			name: "all orders",
			path: "/admin/orders",
			icon: assets.search,
		},
	];

	const logout = async () => {
		try {
			const { data } = await axios.get("/api/admin/logout");
			if (data.success) {
				toast.success(data.message);
				navigate("/");
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			toast.error(error.message);
		}
	};

	return (
		<>
			<div className="flex items-center justify-between px-4 md:px-8 border-b border-primary-forest-green py-3 bg-primary-sage-green/40">
				<Link to="/" className="flex items-center gap-3">
					<img
						className="cursor-pointer w-34 md:w-38"
						src={assets.holisticAfLogoNoBg}
						alt="logo"
					/>
					<h1 className="hidden sm:block text-primary-forest-green">
						admin{" "}
						<span className="text-secondary-golden-honey">
							{" "}
							portal
						</span>
					</h1>
				</Link>
				<div className="flex items-center gap-5 text-primary-forest-green">
					<p>hello admin!</p>
					<button
						onClick={logout}
						className="border rounded-full text-sm px-4 py-1"
					>
						logout
					</button>
				</div>
			</div>
			<div className="flex">
				<div className="md:w-64 w-16 border-r h-[100vh] text-primary-forest-green border-primary-forest-green pt-4 flex flex-col transition-all duration-300 bg-primary-sage-green/40">
					{sidebarLinks.map((item) => (
						<NavLink
							to={item.path}
							key={item.name}
							end={item.path === "/admin"}
							className={({
								isActive,
							}) => `flex items-center py-3 px-4 gap-3 
                            ${
								isActive
									? "border-r-4 md:border-r-[6px]  border-primary-forest-green text-primary-forest-green"
									: "hover:bg-primary-sage-green border-primary-cream "
							}`}
						>
							<img className="w-8 h-8" src={item.icon} alt="" />
							<p className="hidden md:block text-center">
								{item.name}
							</p>
						</NavLink>
					))}
				</div>
				<Outlet />
			</div>
		</>
	);
};

export default AdminLayout;
