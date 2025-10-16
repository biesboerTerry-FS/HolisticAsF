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
import Loading from "./components/Loading";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminLogin from "./components/admin/AdminLogin";
import Inventory from "./pages/admin/Inventory";
import Orders from "./pages/admin/Orders";

const App = () => {
	const isAdminPath = useLocation().pathname.includes("admin");
	const { showUserLogin, isAdmin } = useAppContext();

	return (
		<div className="text-default flex flex-col min-h-screen bg-[#f5f5dc]">
			{isAdminPath ? null : <Navbar />}
			{showUserLogin ? <Login /> : null}
			<Toaster />

			<div
				className={`${
					isAdminPath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32 flex-1"
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
					<Route path="/cart" element={<Cart />} />
					{/* <Route path="/add-address" element={<AddAddress />} /> */}
					{/* <Route path="/my-orders" element={<MyOrders />} /> */}
					{/* <Route path="/loading" element={<Loading />} /> */}
					{/* //^ Admin routes */}
					{/* <Route
						path="/admin"
						element={isAdmin ? <AdminLayout /> : <AdminLogin />}
					/> */}
					{/* <Route index element={isAdmin ? <AddInventory /> : null} /> */}
					{/* <Route path="products-list" element={<Inventory />} /> */}
					{/* <Route path="orders" element={<Orders />} /> */}
				</Routes>
			</div>
			{!isAdminPath && <Footer />}
		</div>
	);
};

export default App;
