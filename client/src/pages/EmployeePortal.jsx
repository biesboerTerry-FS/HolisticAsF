import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";
import {
	DEMO_EMPLOYEE,
	EMPLOYEE_STORAGE_KEY,
	demoShifts,
} from "../data/employee";
import { ensureDemoEmployeeToken } from "../utils/demoAuth";
import { getDemoOrders, getOrderOverrides } from "../data/portalData";
import PendingOrdersWidget from "../components/portal/PendingOrdersWidget";
import OrderStatusControl from "../components/portal/OrderStatusControl";
import MessagesPanel from "../components/portal/MessagesPanel";
import SchedulePanel from "../components/portal/SchedulePanel";

const EMPTY_FORM = { name: "", email: "", phone: "", address: "" };
const TABS = [
	{ id: "overview", label: "Overview" },
	{ id: "orders", label: "Orders" },
	{ id: "messages", label: "Messages" },
	{ id: "schedule", label: "Schedule" },
];

const readLocalEmployee = () => {
	try {
		const stored = JSON.parse(localStorage.getItem(EMPLOYEE_STORAGE_KEY) || "null");
		if (stored?.employeeId) return stored;
	} catch {
		// ignore
	}
	return DEMO_EMPLOYEE;
};

const initialTab = () => {
	try {
		return new URLSearchParams(window.location.search).get("tab") || "overview";
	} catch {
		return "overview";
	}
};

const EmployeePortal = () => {
	const { axios, employee, setEmployee, navigate, currency } = useAppContext();
	const [profile, setProfile] = useState(() => employee || DEMO_EMPLOYEE);
	const [shifts, setShifts] = useState(() => demoShifts());
	const [form, setForm] = useState(EMPTY_FORM);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [offline, setOffline] = useState(false);
	const [tab, setTab] = useState(initialTab);
	const [orders, setOrders] = useState(() => getDemoOrders());

	const persistLocally = (data) => {
		try {
			localStorage.setItem(EMPLOYEE_STORAGE_KEY, JSON.stringify(data));
		} catch {
			// ignore
		}
	};

	useEffect(() => {
		if (!employee) {
			setEmployee(DEMO_EMPLOYEE);
			persistLocally(DEMO_EMPLOYEE);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const applyOverrides = (list) => {
		const overrides = getOrderOverrides();
		return list.map((order) => ({
			...order,
			status: overrides[order._id] || order.status,
		}));
	};

	const load = useCallback(async () => {
		setLoading(true);
		try {
			const employeeId = DEMO_EMPLOYEE.employeeId;
			await ensureDemoEmployeeToken(axios, employeeId);
			const [profileRes, shiftsRes, ordersRes] = await Promise.all([
				axios.get("/api/employees/me", {
					params: { employeeId },
					suppressGlobalErrorToast: true,
				}),
				axios.get("/api/employees/me/shifts", {
					params: { employeeId },
					suppressGlobalErrorToast: true,
				}),
				axios.get("/api/order/staff", { suppressGlobalErrorToast: true }),
			]);

			if (profileRes.data?.success && profileRes.data.employee) {
				const next = { ...DEMO_EMPLOYEE, ...profileRes.data.employee };
				setProfile(next);
				setEmployee(next);
				persistLocally(next);
				setForm({
					name: next.name || "",
					email: next.email || "",
					phone: next.phone || "",
					address: next.address || "",
				});
			} else {
				throw new Error(profileRes.data?.message || "Using local profile");
			}

			if (shiftsRes.data?.success && Array.isArray(shiftsRes.data.shifts) && shiftsRes.data.shifts.length) {
				setShifts(shiftsRes.data.shifts);
			}
			if (ordersRes.data?.success && Array.isArray(ordersRes.data.orders)) {
				setOrders(applyOverrides(ordersRes.data.orders));
			}
			setOffline(false);
		} catch {
			// Demo fallback keeps the portal useful without the backend.
			const local = readLocalEmployee();
			setProfile(local);
			setForm({
				name: local.name || "",
				email: local.email || "",
				phone: local.phone || "",
				address: local.address || "",
			});
			setShifts(demoShifts());
			setOrders(applyOverrides(getDemoOrders()));
			setOffline(true);
		} finally {
			setLoading(false);
		}
	}, [axios, setEmployee]);

	useEffect(() => {
		load();
	}, [load]);

	const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (!form.name.trim()) {
			toast.error("Name is required");
			return;
		}
		setSaving(true);
		const next = {
			...profile,
			name: form.name.trim(),
			email: form.email.trim(),
			phone: form.phone.trim(),
			address: form.address.trim(),
		};
		try {
			const { data } = await axios.patch(
				"/api/employees/me",
				{
					employeeId: next.employeeId,
					name: next.name,
					email: next.email,
					phone: next.phone,
					address: next.address,
				},
				{ suppressGlobalErrorToast: true },
			);
			if (!data?.success) throw new Error(data?.message || "Failed to save");
			const updated = { ...DEMO_EMPLOYEE, ...data.employee };
			setProfile(updated);
			setEmployee(updated);
			persistLocally(updated);
			setOffline(false);
			toast.success("Profile updated");
		} catch {
			setProfile(next);
			setEmployee(next);
			persistLocally(next);
			setOffline(true);
			toast.success("Profile saved locally");
		} finally {
			setSaving(false);
		}
	};

	const signOut = () => {
		try {
			localStorage.removeItem(EMPLOYEE_STORAGE_KEY);
		} catch {
			// ignore
		}
		setEmployee(null);
		navigate("/");
	};

	const displayDate = (value) => {
		if (!value) return "—";
		const date = new Date(`${value}T00:00:00`);
		return Number.isNaN(date.getTime())
			? value
			: date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
	};

	const handleOrderStatusUpdated = (orderId, status) => {
		setOrders((current) =>
			current.map((order) =>
				order._id === orderId ? { ...order, status } : order,
			),
		);
	};

	const pendingCount = useMemo(
		() => orders.filter((order) => (order.status || "pending").toLowerCase() === "pending").length,
		[orders],
	);

	return (
		<div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(157,191,175,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(224,160,48,0.10),transparent_30%)] bg-secondary-soft-beige px-4 py-6 text-primary-forest-green md:px-8 lg:px-16">
			<div className="mx-auto max-w-5xl space-y-6">
				<div className="flex flex-col gap-3 rounded-3xl border border-primary-forest-green/10 bg-primary-warm-white/80 p-5 shadow-sm backdrop-blur md:flex-row md:items-end md:justify-between md:p-6">
					<div>
						<p className="text-xs font-medium uppercase tracking-[0.16em] text-primary-forest-green/50">Employee</p>
						<h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
							My <span className="text-secondary-golden-honey">portal</span>
						</h1>
						<p className="mt-1 text-sm text-primary-forest-green/65">
							Your details, orders, messages and schedule — nothing else.
						</p>
					</div>
					<div className="flex flex-wrap gap-2">
						<Link
							to="/"
							className="rounded-full border border-primary-forest-green/15 bg-primary-warm-white/70 px-4 py-2 text-sm font-medium transition hover:bg-primary-sage-green/15"
						>
							Back to store
						</Link>
						<button
							onClick={signOut}
							className="rounded-full bg-primary-forest-green px-4 py-2 text-sm font-medium text-primary-cream transition hover:opacity-90"
						>
							Sign out
						</button>
					</div>
				</div>

				{offline ? (
					<div className="rounded-2xl border border-semantic-warning/25 bg-semantic-warning/10 p-4 text-sm text-primary-forest-green/80">
						Backend unavailable — showing locally saved demo data. Changes are saved on this device.
					</div>
				) : null}

				<nav className="flex flex-wrap gap-2" aria-label="Employee portal sections">
					{TABS.map((item) => (
						<button
							key={item.id}
							data-testid={`employee-tab-${item.id}`}
							onClick={() => setTab(item.id)}
							className={`rounded-full px-4 py-2 text-sm font-medium transition ${
								tab === item.id
									? "bg-primary-forest-green text-primary-cream shadow-sm"
									: "border border-primary-forest-green/15 bg-primary-warm-white/70 text-primary-forest-green/75 hover:bg-primary-sage-green/15"
							}`}
						>
							{item.label}
							{item.id === "orders" && pendingCount ? (
								<span className="ml-2 rounded-full bg-secondary-golden-honey/25 px-1.5 text-xs">
									{pendingCount}
								</span>
							) : null}
						</button>
					))}
				</nav>

				{tab === "overview" ? (
					<div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
						<section className="rounded-3xl border border-primary-forest-green/10 bg-primary-warm-white/80 p-4 shadow-sm backdrop-blur md:p-5 lg:col-span-2">
							<h2 className="text-lg font-semibold tracking-tight">My details</h2>
							<p className="mt-1 text-xs text-primary-forest-green/55">Read-only summary</p>
							{loading ? (
								<div className="mt-5 space-y-3">
									<div className="h-12 animate-pulse rounded-xl bg-primary-sage-green/10" />
									<div className="h-12 animate-pulse rounded-xl bg-primary-sage-green/10" />
									<div className="h-12 animate-pulse rounded-xl bg-primary-sage-green/10" />
								</div>
							) : (
								<dl className="mt-5 space-y-3 text-sm">
									{[
										["Name", profile.name],
										["Position", profile.position],
										["Email", profile.email],
										["Phone", profile.phone],
										["Address", profile.address],
									].map(([label, value]) => (
										<div key={label} className="rounded-2xl border border-primary-forest-green/8 bg-secondary-soft-beige/60 p-3.5">
											<dt className="text-[11px] font-medium uppercase tracking-[0.12em] text-primary-forest-green/50">{label}</dt>
											<dd className="mt-1 font-medium text-primary-forest-green">{value || "—"}</dd>
										</div>
									))}
								</dl>
							)}
						</section>

						<div className="space-y-6 lg:col-span-3">
							<PendingOrdersWidget detailsPath="/employee?tab=orders" />

							<section className="rounded-3xl border border-primary-forest-green/10 bg-primary-warm-white/80 p-4 shadow-sm backdrop-blur md:p-5">
								<h2 className="text-lg font-semibold tracking-tight">Upcoming shifts</h2>
								<p className="text-xs text-primary-forest-green/55">Only your scheduled shifts</p>
								{loading ? (
									<div className="mt-4 space-y-2">
										<div className="h-14 animate-pulse rounded-xl bg-primary-sage-green/10" />
										<div className="h-14 animate-pulse rounded-xl bg-primary-sage-green/10" />
									</div>
								) : shifts.length === 0 ? (
									<p className="mt-4 rounded-2xl border border-dashed border-primary-forest-green/15 p-6 text-center text-sm text-primary-forest-green/60">
										No upcoming shifts.
									</p>
								) : (
									<ul className="mt-4 space-y-2.5">
										{shifts.map((shift) => (
											<li key={shift._id || `${shift.date}-${shift.startTime}`} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-primary-forest-green/8 bg-gradient-to-br from-primary-sage-green/10 to-transparent p-3.5">
												<div>
													<p className="font-medium">{displayDate(shift.date)}</p>
													<p className="text-xs text-primary-forest-green/60">
														{shift.startTime}–{shift.endTime} {shift.role ? `• ${shift.role}` : ""}
													</p>
												</div>
												<span className="rounded-full border border-primary-forest-green/10 bg-secondary-soft-beige/70 px-2.5 py-1 text-xs font-medium capitalize">
													{shift.status || "scheduled"}
												</span>
											</li>
										))}
									</ul>
								)}
							</section>
						</div>
					</div>
				) : null}

				{tab === "orders" ? (
					<div data-testid="employee-orders" className="space-y-4">
						<div className="rounded-3xl border border-primary-forest-green/10 bg-primary-warm-white/75 p-5 shadow-sm backdrop-blur md:p-6">
							<h2 className="text-2xl font-semibold tracking-tight">
								Order <span className="text-secondary-golden-honey">fulfillment</span>
							</h2>
							<p className="mt-1 text-sm text-primary-forest-green/65">
								Advance orders through preparing, ready, and completed.
							</p>
						</div>
						<div className="grid gap-3">
							{orders.length === 0 ? (
								<div className="rounded-2xl border border-dashed border-primary-forest-green/15 p-8 text-center text-sm text-primary-forest-green/60">
									No orders found.
								</div>
							) : (
								orders.map((order) => {
									const amount = typeof order.amount === "object" ? order.amount?.total : order.amount;
									return (
										<div key={order._id} className="rounded-2xl border border-primary-forest-green/10 bg-primary-warm-white/75 p-4 shadow-sm backdrop-blur md:p-5">
											<div className="flex flex-wrap items-start justify-between gap-3">
												<div className="min-w-0">
													<p className="font-mono text-xs text-primary-forest-green/55">
														Order #{String(order._id).slice(-8)}
													</p>
													<p className="mt-1 text-sm font-medium">
														{order.address?.firstName || order.customer || "Guest"}{" "}
														{order.address?.lastName || ""} · {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "—"}
													</p>
													<p className="mt-1 text-xs text-primary-forest-green/60">
														{(order.items || []).map((item) => `${item.name || "Item"} ×${item.quantity || 1}`).join(", ") || "No items"}
													</p>
												</div>
												<div className="text-right">
													<p className="text-lg font-semibold">{currency}{Number(amount || 0).toFixed(2)}</p>
													<OrderStatusControl
														order={order}
														onUpdated={handleOrderStatusUpdated}
													/>
												</div>
											</div>
										</div>
									);
								})
							)}
						</div>
					</div>
				) : null}

				{tab === "messages" ? (
					<div className="space-y-4">
						<div className="rounded-3xl border border-primary-forest-green/10 bg-primary-warm-white/75 p-5 shadow-sm backdrop-blur md:p-6">
							<h2 className="text-2xl font-semibold tracking-tight">
								Team <span className="text-secondary-golden-honey">messages</span>
							</h2>
							<p className="mt-1 text-sm text-primary-forest-green/65">
								Messages sent to you and your team.
							</p>
						</div>
						<MessagesPanel role="employee" />
					</div>
				) : null}

				{tab === "schedule" ? (
					<div className="space-y-4">
						<div className="rounded-3xl border border-primary-forest-green/10 bg-primary-warm-white/75 p-5 shadow-sm backdrop-blur md:p-6">
							<h2 className="text-2xl font-semibold tracking-tight">
								My <span className="text-secondary-golden-honey">schedule</span>
							</h2>
							<p className="mt-1 text-sm text-primary-forest-green/65">
								Shifts, requests, time off, and availability.
							</p>
						</div>
						<SchedulePanel
							role="employee"
							employeeId={profile.employeeId}
							employeeName={profile.name}
							shifts={shifts}
						/>
					</div>
				) : null}

				{tab === "overview" ? (
					<form onSubmit={handleSubmit} className="rounded-3xl border border-primary-forest-green/10 bg-primary-warm-white/80 p-4 shadow-sm backdrop-blur md:p-5">
						<h2 className="text-lg font-semibold tracking-tight">Edit my info</h2>
						<p className="text-xs text-primary-forest-green/55">Only your name, address, phone, and email can be changed.</p>
						<div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
							{[
								["name", "Name", "text"],
								["phone", "Phone", "tel"],
								["email", "Email", "email"],
							].map(([field, label, type]) => (
								<label key={field} className="block">
									<span className="text-[11px] font-medium uppercase tracking-[0.12em] text-primary-forest-green/55">{label}</span>
									<input
										type={type}
										value={form[field]}
										onChange={(e) => setField(field, e.target.value)}
										className="mt-1.5 w-full rounded-xl border border-primary-forest-green/10 bg-secondary-soft-beige/80 px-3.5 py-2.5 text-sm outline-none transition focus:border-secondary-golden-honey/60 focus:ring-4 focus:ring-secondary-golden-honey/10"
									/>
								</label>
							))}
							<label className="block sm:col-span-2">
								<span className="text-[11px] font-medium uppercase tracking-[0.12em] text-primary-forest-green/55">Address</span>
								<input
									type="text"
									value={form.address}
									onChange={(e) => setField("address", e.target.value)}
									className="mt-1.5 w-full rounded-xl border border-primary-forest-green/10 bg-secondary-soft-beige/80 px-3.5 py-2.5 text-sm outline-none transition focus:border-secondary-golden-honey/60 focus:ring-4 focus:ring-secondary-golden-honey/10"
								/>
							</label>
						</div>
						<button
							type="submit"
							disabled={saving}
							className="mt-4 rounded-full bg-primary-forest-green px-5 py-2.5 text-sm font-medium text-primary-cream shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
						>
							{saving ? "Saving…" : "Save changes"}
						</button>
					</form>
				) : null}
			</div>
		</div>
	);
};

export default EmployeePortal;
