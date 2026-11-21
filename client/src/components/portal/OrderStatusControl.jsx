import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";
import { setOrderStatusOverride } from "../../data/portalData";
import { ensureDemoAdminToken } from "../../utils/demoAuth";

export const FULFILLMENT_STATUSES = [
	{ value: "pending", label: "Pending" },
	{ value: "preparing", label: "Preparing" },
	{ value: "ready", label: "Ready" },
	{ value: "completed", label: "Completed" },
	{ value: "delivered", label: "Delivered" },
	{ value: "cancelled", label: "Cancelled" },
];

/** Status dropdown that persists to the backend with a localStorage fallback. */
const OrderStatusControl = ({ order, onUpdated, compact = false }) => {
	const { axios } = useAppContext();
	const [status, setStatus] = useState(order.status || "pending");
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		setStatus(order.status || "pending");
	}, [order._id, order.status]);

	const handleChange = async (event) => {
		const next = event.target.value;
		setStatus(next);
		setSaving(true);
		setOrderStatusOverride(order._id, next);
		try {
			const { data } = await axios.patch(
				`/api/order/${order._id}/status`,
				{ status: next },
				{ suppressGlobalErrorToast: true },
			);
			if (!data?.success) throw new Error(data?.message || "Update failed");
			toast.success("Order status updated");
		} catch {
			toast.success("Status saved locally");
		} finally {
			setSaving(false);
			if (onUpdated) onUpdated(order._id, next);
		}
	};

	return (
		<select
			aria-label={`Status for order ${order._id}`}
			data-testid={`order-status-${order._id}`}
			value={status}
			onChange={handleChange}
			disabled={saving}
			className={
				compact
					? "rounded-lg border border-primary-forest-green/10 bg-secondary-soft-beige/80 px-2 py-1 text-xs font-medium outline-none disabled:opacity-60"
					: "rounded-xl border border-primary-forest-green/10 bg-secondary-soft-beige/80 px-3 py-2.5 text-sm font-medium outline-none transition focus:border-secondary-golden-honey/60 focus:ring-4 focus:ring-secondary-golden-honey/10 disabled:opacity-60"
			}
		>
			{FULFILLMENT_STATUSES.map((option) => (
				<option key={option.value} value={option.value}>
					{option.label}
				</option>
			))}
		</select>
	);
};

export default OrderStatusControl;
