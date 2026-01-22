import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { assets, dummyOrders } from "../../assets/assets";
import toast from "react-hot-toast";

const Orders = () => {
	const { currency } = useAppContext();
	const [orders, setOrders] = useState([]);

	const fetchOrders = async () => {
		setOrders(dummyOrders);
	};

	useEffect(() => {
		fetchOrders();
	}, []);

	return (
		<div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll">
			<div className="md:p-10 p-4 space-y-4">
				<h2 className="text-lg font-medium text-primary-forest-green">
					orders{" "}
					<span className="text-secondary-golden-honey">list</span>
				</h2>
				{orders.map((order, index) => (
					<div
						key={index}
						className="flex flex-col md:items-center md:flex-row justify-between gap-5 p-5 max-w-5xl rounded-md border border-primary-forest-green"
					>
						<div className="flex gap-5 min-w-80">
							<img
								className="w-12 h-12 object-cover"
								src={assets.boxIcon}
								alt="boxIcon"
							/>
							<div>
								{order.items.map((item, index) => (
									<div key={index} className="flex flex-col">
										<p className="font-medium">
											{item.product.name}{" "}
											<span
												className={`text-primary-forest-green ${item.quantity < 1 && "hidden"}`}
											>
												x {item.quantity}
											</span>
										</p>
									</div>
								))}
							</div>
						</div>

						<div className="text-sm md:text-base text-primary-forest-green/60">
							<p className="text-primary-forest-green/90">
								{order.address.firstName}{" "}
								{order.address.lastName}
							</p>
							<p>{order.address.street}</p>
							<p>
								{order.address.city},{order.address.state},
								{order.address.zipcode},
							</p>
							<p></p>
							<p>{order.address.phone}</p>
						</div>

						<p className="font-medium text-large my-auto text-primary-forest-green">
							{currency}
							{order.amount}
						</p>

						<div className="flex flex-col text-sm md:text-base text-primary-forest-green/60 gap-1">
							<p>method: {order.paymentType}</p>
							<p>
								date:{" "}
								{new Date(order.createdAt).toLocaleDateString()}
							</p>
							<p>payment: {order.isPaid ? "paid" : "pending"}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Orders;
