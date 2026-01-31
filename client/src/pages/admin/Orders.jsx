import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { assets, dummyOrders } from "../../assets/assets";
import toast from "react-hot-toast";

const Orders = () => {
	const { currency, axios } = useAppContext();
	const [orders, setOrders] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");

	const fetchOrders = async () => {
		try {
			const { data } = await axios.get("/api/order/admin");
			if (data.success) {
				setOrders(data.orders);
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			console.error(error);
			setOrders(dummyOrders || []);
		}
	};

	const statusHandler = async (event, orderId) => {
		try {
			const newStatus = event.target.value;
			const { data } = await axios.post("/api/order/status", {
				orderId,
				status: newStatus,
			});

			if (data.success) {
				await fetchOrders();
				toast.success("Status updated");
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			console.error(error);
			toast.error(error.message);
		}
	};

	useEffect(() => {
		fetchOrders();
	}, []);

	const filteredOrders = orders.filter((order) => {
		const search = searchTerm.toLowerCase();
		const matchesId = order._id.toLowerCase().includes(search);
		const matchesProduct = order.items.some((item) =>
			item.name.toLowerCase().includes(search),
		);
		return matchesId || matchesProduct;
	});

	return (
		<div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll">
			<div className="md:p-10 p-4 space-y-4">
				<h2 className="text-lg font-medium text-primary-forest-green">
					orders{" "}
					<span className="text-secondary-golden-honey">list</span>
				</h2>
				<div className="max-w-6xl w-full">
					<input
						type="text"
						placeholder="Search by Order ID or Product Name..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full p-3 border border-primary-forest-green rounded-md outline-none focus:ring-1 focus:ring-secondary-golden-honey"
					/>
				</div>

				{filteredOrders && filteredOrders.length > 0 ? (
					filteredOrders.map((order, index) => (
						<div
							key={order._id || index}
							className="flex flex-col max-w-6xl space-y-1 mb-4"
						>
							<span className="text-[10px] font-mono text-primary-forest-green/40 ml-1 uppercase">
								Order ID: {order._id}
							</span>

							<div className="flex flex-col md:items-center md:flex-row justify-between gap-5 p-5 rounded-md border border-primary-forest-green bg-primary-sage-green/30 shadow-sm">
								<div className="flex gap-5 min-w-80">
									<img
										className="w-12 h-12 object-cover"
										src={assets.boxIcon}
										alt="boxIcon"
									/>
									<div>
										{order.items.map((item, i) => (
											<div
												key={i}
												className="flex flex-col justify-center"
											>
												<p className="font-medium text-primary-forest-green">
													{item.name}{" "}
													<span className="text-primary-forest-green/60 text-sm">
														x {item.quantity}
													</span>
												</p>
											</div>
										))}
									</div>
								</div>

								<p className="font-semibold text-lg text-primary-forest-green">
									{currency}
									{typeof order.amount === "object"
										? order.amount.total
										: order.amount}
								</p>

								<div className="flex flex-col text-sm text-primary-forest-green/60 gap-1">
									<p>
										Method:{" "}
										<span className="uppercase">
											{order.paymentType}
										</span>
									</p>
									<p>
										Date:{" "}
										{new Date(
											order.createdAt,
										).toLocaleDateString()}
									</p>
									<p>
										Payment:{" "}
										<span
											className={
												order.isPaid
													? "text-primary-forest-green"
													: "text-semantic-error"
											}
										>
											{order.isPaid ? "Paid" : "Pending"}
										</span>
									</p>
								</div>

								<select
									onChange={(e) =>
										statusHandler(e, order._id)
									}
									value={order.status}
									className="p-2 text-sm font-semibold border border-primary-forest-green rounded-md bg-secondary-soft-beige text-primary-forest-green outline-none cursor-pointer"
								>
									<option value="pending">Pending</option>
									<option value="processing">
										Processing
									</option>
									<option value="shipped">Shipped</option>
									<option value="delivered">Delivered</option>
									<option value="cancelled">Cancelled</option>
								</select>
							</div>
						</div>
					))
				) : (
					<div className="text-center py-10">
						<p className="text-primary-forest-green/50">
							{searchTerm
								? "No orders match your search."
								: "No orders found in database."}
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default Orders;
