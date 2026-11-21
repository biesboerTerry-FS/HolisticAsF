import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import {
	getDemoOrders,
	getOrderOverrides,
} from "../../data/portalData";
import { ensureDemoAdminToken } from "../../utils/demoAuth";

const isPending = (order) => (order.status || "pending").toLowerCase() === "pending";

/** Recent pending orders — shared by the admin and employee dashboards. */
const PendingOrdersWidget = ({ limit = 4, detailsPath = "/admin/orders" }) => {
	const { axios, currency, isAdmin } = useAppContext();
	const [orders, setOrders] = useState(() => getDemoOrders());

	useEffect(() => {
		let active = true;
		const load = async () => {
			try {
				if (isAdmin) await ensureDemoAdminToken(axios);
				const { data } = await axios.get("/api/order/staff", {
					suppressGlobalErrorToast: true,
				});
				if (active && data?.success && Array.isArray(data.orders)) {
					setOrders(data.orders);
				}
			} catch {
				// Keep the seeded demo orders visible when the API is unavailable.
			}
		};
		load();
		return () => {
			active = false;
		};
	}, [axios, isAdmin]);

	const pending = useMemo(() => {
		const overrides = getOrderOverrides();
		return orders
			.map((order) => ({
				...order,
				status: overrides[order._id] || order.status,
			}))
			.filter(isPending)
			.slice(0, limit);
	}, [orders, limit]);

	return (
		<section
			data-testid="pending-orders-widget"
			className="rounded-3xl border border-secondary-golden-honey/25 bg-primary-warm-white/75 p-4 shadow-sm backdrop-blur md:p-5"
		>
			<div className="flex items-center justify-between gap-3">
				<div>
					<h3 className="text-lg font-semibold tracking-tight">Pending orders</h3>
					<p className="text-xs text-primary-forest-green/55">
						Recent orders that still need attention
					</p>
				</div>
				<span className="rounded-full bg-secondary-golden-honey/20 px-2.5 py-1 text-xs font-semibold text-secondary-earthy-brown">
					{pending.length}
				</span>
			</div>
			{pending.length === 0 ? (
				<p className="mt-4 rounded-2xl border border-dashed border-primary-forest-green/15 p-6 text-center text-sm text-primary-forest-green/60">
					Nothing pending right now.
				</p>
			) : (
				<ul className="mt-4 space-y-2">
					{pending.map((order) => {
						const amount =
							typeof order.amount === "object"
								? order.amount?.total
								: order.amount;
						const customer =
							order.address?.firstName ||
							order.customer ||
							"Guest customer";
						return (
							<li
								key={order._id}
								className="flex items-center justify-between gap-3 rounded-2xl border border-primary-forest-green/8 bg-secondary-soft-beige/50 px-3.5 py-2.5"
							>
								<div className="min-w-0">
									<p className="truncate text-sm font-medium">
										{customer}{" "}
										<span className="font-normal text-primary-forest-green/55">
											· {String(order._id).slice(-6)}
										</span>
									</p>
									<p className="truncate text-xs text-primary-forest-green/60">
										{(order.items || [])
											.map((item) => `${item.name || "Item"} ×${item.quantity || 1}`)
											.join(", ") || "No items"}
									</p>
								</div>
								<div className="text-right">
									<p className="text-sm font-semibold">
										{currency}{Number(amount || 0).toFixed(2)}
									</p>
									<p className="text-[11px] text-primary-forest-green/55">
										{order.createdAt
											? new Date(order.createdAt).toLocaleDateString()
											: "—"}
									</p>
								</div>
							</li>
						);
					})}
				</ul>
			)}
			<div className="mt-4">
				<Link
					to={detailsPath}
					className="text-sm font-medium text-primary-forest-green/80 underline decoration-primary-forest-green/30 underline-offset-4 hover:text-primary-forest-green"
				>
					View all orders →
				</Link>
			</div>
		</section>
	);
};

export default PendingOrdersWidget;
