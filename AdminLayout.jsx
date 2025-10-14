import { Link, NavLink, Outlet } from "react-router-dom";
import React from "react";
import toast from "react-hot-toast";
import { assets } from "../../assets/assets";

const AdminLayout = () => {
	const { axios, navigate } = useAppContext();

	const sidebarLinks = [
		{
			name: "Receive Inventory",
			path: "/admin/receive-inventory",
			icon: assets.addIcon,
		},
		{
			name: "Inventory",
			path: "/admin/inventory",
			icon: assets.list,
		},
		{ name: "Orders", path: "/admin/orders", icon: assets.boxIcon },
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
			<div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white">
				<Link to="/">
					<img
						className="cursor-pointer w-34 md:w-38"
						src={assets.holisticAfLogo}
						alt="logo"
					/>
				</Link>
				<div className="flex items-center gap-5 text-gray-500">
					<p>
						Hello Admin!
						{/*//^ ${ AdminLayout.name } */}
					</p>
					<button
						onClick={logout}
						className="border rounded-full text-sm px-4 py-1"
					>
						Logout
					</button>
				</div>
			</div>
			<div className="flex">
				<div className="md:w-64 w-16 border-r h-[550px] text-base border-gray-300 pt-4 flex flex-col">
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
									? "border-r-4 md:border-r-[6px] bg-primary/10 border-primary text-primary"
									: "hover:bg-primary-dull border-white"
							}`}
						>
							<img className="w-7 h-7" src={item.icon} alt="" />
							<p className="md:block hidden text-center">
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
