import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { getHttpErrorMessage } from "../../utils/http";

const StatCard = ({ label, value, hint, tone = "default" }) => {
	const tones = {
		default: "from-primary-warm-white/90 to-primary-sage-green/10",
		warn: "from-primary-warm-white/90 to-secondary-golden-honey/10",
		success: "from-primary-warm-white/90 to-semantic-success/10",
	};
	return (
		<div className={`group rounded-2xl border border-primary-forest-green/10 bg-gradient-to-br ${tones[tone] || tones.default} p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md md:p-5`}>
			<p className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary-forest-green/55">{label}</p>
			<p className="mt-2 text-2xl font-semibold tracking-tight text-primary-forest-green md:text-3xl">{value}</p>
			{hint ? <p className="mt-1.5 text-xs text-primary-forest-green/60">{hint}</p> : null}
		</div>
	);
};

const Dashboard = () => {
	const { axios, currency } = useAppContext();
	const [orders, setOrders] = useState([]);
	const [inventoryCount, setInventoryCount] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		let active = true;

		const load = async () => {
			setLoading(true);
			setError("");
			const results = await Promise.allSettled([
				axios.get("/api/order/admin", { suppressGlobalErrorToast: true }),
				axios.get("/api/inventory/inventory", { suppressGlobalErrorToast: true }),
			]);

			if (!active) return;

			const [ordersRes, inventoryRes] = results;
			const errors = [];

			if (ordersRes.status === "fulfilled" && ordersRes.value.data?.success) {
				setOrders(ordersRes.value.data.orders || []);
			} else {
				const err = ordersRes.status === "rejected" ? ordersRes.reason : ordersRes.value;
				errors.push(`Orders: ${getHttpErrorMessage(err, "Failed to load orders")}`);
				setOrders([]);
			}

			if (inventoryRes.status === "fulfilled" && inventoryRes.value.data?.success) {
				const products = inventoryRes.value.data.products || [];
				setInventoryCount(Array.isArray(products) ? products.length : 0);
			} else {
				const err = inventoryRes.status === "rejected" ? inventoryRes.reason : inventoryRes.value;
				errors.push(`Inventory: ${getHttpErrorMessage(err, "Failed to load inventory")}`);
				setInventoryCount(0);
			}

			setError(errors.join(" "));
			setLoading(false);
		};

		load();
		return () => {
			active = false;
		};
	}, [axios]);

	const stats = useMemo(() => {
		const totalOrders = orders.length;
		const pendingOrders = orders.filter((o) => (o.status || "").toLowerCase() === "pending").length;
		const paidOrders = orders.filter((o) => o.isPaid).length;
		const revenue = orders.reduce((sum, order) => {
			const amount = typeof order.amount === "object" ? order.amount?.total : order.amount;
			const value = Number(amount);
			return sum + (Number.isFinite(value) ? value : 0);
		}, 0);

		return { totalOrders, pendingOrders, paidOrders, revenue };
	}, [orders]);

	const recentOrders = useMemo(() => orders.slice(0, 5), [orders]);

	return (
		<div className="p-4 md:p-6 lg:p-8 text-primary-forest-green">
			<div className="mx-auto max-w-6xl space-y-6">
				<div className="flex flex-col gap-4 rounded-3xl border border-primary-forest-green/10 bg-gradient-to-r from-primary-warm-white/90 via-primary-warm-white/80 to-primary-sage-green/10 p-5 shadow-sm md:flex-row md:items-end md:justify-between md:p-6">
					<div>
						<p className="text-xs font-medium uppercase tracking-[0.16em] text-primary-forest-green/50">Overview</p>
						<h2 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
							Admin <span className="text-secondary-golden-honey">dashboard</span>
						</h2>
						<p className="mt-1 text-sm text-primary-forest-green/65">
							Track performance, review recent orders, and jump into daily tasks.
						</p>
					</div>
					<div className="flex flex-wrap gap-2">
						<Link
							to="/admin/add-inventory"
							className="rounded-full bg-primary-forest-green px-4 py-2 text-sm font-medium text-primary-cream shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
						>
							Add product
						</Link>
						<Link
							to="/admin/orders"
							className="rounded-full border border-primary-forest-green/15 bg-primary-warm-white/70 px-4 py-2 text-sm font-medium transition hover:bg-primary-sage-green/15"
						>
							View orders
						</Link>
					</div>
				</div>

				{error ? (
					<div className="rounded-2xl border border-semantic-error/20 bg-semantic-error/10 p-4 text-sm text-semantic-error shadow-sm">
						{error}
					</div>
				) : null}

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
					<StatCard label="Total orders" value={loading ? "—" : stats.totalOrders} hint="All time orders" />
					<StatCard label="Pending orders" value={loading ? "—" : stats.pendingOrders} hint="Needs attention" tone="warn" />
					<StatCard label="Paid orders" value={loading ? "—" : stats.paidOrders} hint="Completed payments" tone="success" />
					<StatCard
						label="Revenue"
						value={loading ? "—" : `${currency}${stats.revenue.toFixed(2)}`}
						hint={`Inventory items: ${loading ? "—" : inventoryCount}`}
					/>
				</div>

				<div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
					<section className="xl:col-span-2 rounded-3xl border border-primary-forest-green/10 bg-primary-warm-white/75 p-4 shadow-sm backdrop-blur md:p-5">
						<div className="mb-4 flex items-center justify-between">
							<div>
								<h3 className="text-lg font-semibold tracking-tight">Recent orders</h3>
								<p className="text-xs text-primary-forest-green/55">Latest activity from your store</p>
							</div>
							<Link to="/admin/orders" className="text-sm font-medium text-primary-forest-green/80 underline decoration-primary-forest-green/30 underline-offset-4 hover:text-primary-forest-green">
								See all
							</Link>
						</div>
						{loading ? (
							<div className="space-y-2">
								<div className="h-10 animate-pulse rounded-xl bg-primary-sage-green/10" />
								<div className="h-10 animate-pulse rounded-xl bg-primary-sage-green/10" />
								<div className="h-10 animate-pulse rounded-xl bg-primary-sage-green/10" />
							</div>
						) : recentOrders.length === 0 ? (
							<div className="rounded-2xl border border-dashed border-primary-forest-green/15 bg-secondary-soft-beige/50 p-8 text-center text-sm text-primary-forest-green/60">
								No orders found yet.
							</div>
						) : (
							<div className="overflow-x-auto">
								<table className="w-full min-w-[640px] text-left text-sm">
									<thead className="text-primary-forest-green/55">
										<tr className="border-b border-primary-forest-green/10">
											<th className="py-2.5 pr-3 font-medium">Order</th>
											<th className="py-2.5 pr-3 font-medium">Date</th>
											<th className="py-2.5 pr-3 font-medium">Items</th>
											<th className="py-2.5 pr-3 font-medium">Amount</th>
											<th className="py-2.5 pr-3 font-medium">Status</th>
										</tr>
									</thead>
									<tbody>
										{recentOrders.map((order) => {
											const amount = typeof order.amount === "object" ? order.amount?.total : order.amount;
											const itemCount = Array.isArray(order.items)
												? order.items.reduce((n, i) => n + (Number(i.quantity) || 0), 0)
												: 0;
											const status = (order.status || "pending").toLowerCase();
											return (
												<tr key={order._id} className="border-b border-primary-forest-green/8 last:border-0 transition hover:bg-primary-sage-green/5">
													<td className="py-3.5 pr-3 font-mono text-xs text-primary-forest-green/75">{String(order._id).slice(-8)}</td>
													<td className="py-3.5 pr-3 text-primary-forest-green/80">
														{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "—"}
													</td>
													<td className="py-3.5 pr-3">{itemCount}</td>
													<td className="py-3.5 pr-3 font-medium">{currency}{Number(amount || 0).toFixed(2)}</td>
													<td className="py-3.5 pr-3">
														<span className="inline-flex rounded-full border border-primary-forest-green/10 bg-secondary-soft-beige/70 px-2.5 py-1 text-xs font-medium capitalize text-primary-forest-green/80">
															{status}
														</span>
													</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>
						)}
					</section>

					<section className="rounded-3xl border border-primary-forest-green/10 bg-primary-warm-white/75 p-4 shadow-sm backdrop-blur md:p-5">
						<h3 className="text-lg font-semibold tracking-tight">Suggested tasks</h3>
						<p className="mt-1 text-xs text-primary-forest-green/55">Quick priorities for today</p>
						<ul className="mt-4 space-y-3 text-sm text-primary-forest-green/80">
							<li className="rounded-2xl border border-primary-forest-green/8 bg-gradient-to-br from-primary-sage-green/10 to-transparent p-3.5">
								<p className="font-medium text-primary-forest-green">Review pending orders</p>
								<p className="mt-1 text-xs leading-relaxed text-primary-forest-green/65">Update fulfillment status to keep customers informed and operations smooth.</p>
							</li>
							<li className="rounded-2xl border border-primary-forest-green/8 bg-gradient-to-br from-secondary-golden-honey/10 to-transparent p-3.5">
								<p className="font-medium text-primary-forest-green">Audit inventory listings</p>
								<p className="mt-1 text-xs leading-relaxed text-primary-forest-green/65">Confirm images, names, categories, and pricing are accurate.</p>
							</li>
							<li className="rounded-2xl border border-primary-forest-green/8 bg-gradient-to-br from-primary-sage-green/10 to-transparent p-3.5">
								<p className="font-medium text-primary-forest-green">Monitor failed requests</p>
								<p className="mt-1 text-xs leading-relaxed text-primary-forest-green/65">HTTP/network issues now surface with toasts and inline feedback.</p>
							</li>
						</ul>
						<div className="mt-4 rounded-2xl border border-primary-forest-green/10 bg-secondary-soft-beige/50 p-3.5 text-xs text-primary-forest-green/70">
							<p className="font-semibold text-primary-forest-green">Next ideas</p>
							<p className="mt-1 leading-relaxed">Contact inbox, low-stock alerts, product edit/delete, analytics, and role-based access.</p>
						</div>
					</section>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
