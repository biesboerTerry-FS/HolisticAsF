import React from "react";
import { Toaster } from "react-hot-toast";
import { Route, Routes, useLocation } from "react-router-dom";
import { useAppContext } from "./context/AppContext";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import ProductCategory from "./pages/ProductCategory";
import Cart from "./pages/Cart";
import AddAddress from "./pages/AddAddress";
import AddInventory from "./pages/admin/AddInventory";
import MyOrders from "./pages/MyOrders";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminLogin from "./components/admin/AdminLogin";
import Inventory from "./pages/admin/Inventory";
import Orders from "./pages/admin/Orders";
import Dashboard from "./pages/admin/Dashboard";
import Announcements from "./pages/admin/Announcements";
import Schedule from "./pages/admin/Schedule";
import Messages from "./pages/admin/Messages";
import Contact from "./pages/Contact";
import Featured from "./pages/Featured";
import EmployeePortal from "./pages/EmployeePortal";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import HrShell from "./pages/admin/hr/HrShell";
import EmployeeDirectory from "./pages/admin/hr/EmployeeDirectory";
import Payroll from "./pages/admin/hr/Payroll";
import TimeOff from "./pages/admin/hr/TimeOff";
import Performance from "./pages/admin/hr/Performance";
import HrSettings from "./pages/admin/hr/Settings";

// The admin deployment shares this source with the client. Detect it by host
// so /login renders the admin-styled sign-in without storefront nav/cart.
const isAdminDeployment = () => {
	if (typeof window === "undefined") return false;
	return /holisticasf-admin/.test(window.location.hostname);
};

const App = () => {
	const { pathname } = useLocation();
	const isAdminPath = pathname.includes("admin");
	const isAdminLogin = pathname === "/login" && isAdminDeployment();
	const hideStorefrontChrome = isAdminPath || isAdminLogin;
	const { showUserLogin, isAdmin } = useAppContext();

	return (
		<div className="text-default flex flex-col min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(157,191,175,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(224,160,48,0.10),transparent_30%)] bg-secondary-soft-beige">
			{hideStorefrontChrome ? null : <Navbar />}
			{showUserLogin && !hideStorefrontChrome ? <Login /> : null}
			<Toaster />

			<div
				className={`${
					hideStorefrontChrome ? "" : "px-4 sm:px-8 lg:px-16 xl:px-24 flex-1"
				}`}
			>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/products" element={<Products />} />
					<Route
						path="/products/:category"
						element={<ProductCategory />}
					/>
					<Route
						path="/products/:category/:id"
						element={<ProductDetails />}
					/>
					<Route path="/top-sellers" element={<Featured />} />
					<Route path="/cart" element={<Cart />} />
					<Route path="/add-address" element={<AddAddress />} />
					<Route path="/my-orders" element={<MyOrders />} />
					<Route path="/contact" element={<Contact />} />
					<Route path="/login" element={isAdminLogin ? <AdminLoginPage /> : <Login />} />
					<Route path="/employee" element={<EmployeePortal />} />

					{/* //^ Admin routes (auth disabled for now) */}
					<Route
						path="/admin"
						element={<AdminLayout />}
					>
						<Route index element={<Dashboard />} />
						<Route path="schedule" element={<Schedule />} />
						<Route
							path="add-inventory"
							element={<AddInventory />}
						/>
						<Route path="inventory" element={<Inventory />} />
						<Route path="orders" element={<Orders />} />
						<Route path="announcements" element={<Announcements />} />
						<Route path="messages" element={<Messages />} />
						{/* //^ HR suite (admin only, JWT-protected backend routes) */}
						<Route path="hr" element={<HrShell />}>
							<Route index element={<EmployeeDirectory />} />
							<Route path="payroll" element={<Payroll />} />
							<Route path="time-off" element={<TimeOff />} />
							<Route path="performance" element={<Performance />} />
							<Route path="settings" element={<HrSettings />} />
						</Route>
					</Route>
				</Routes>
			</div>
			{!hideStorefrontChrome && <Footer />}
		</div>
	);
};

export default App;
