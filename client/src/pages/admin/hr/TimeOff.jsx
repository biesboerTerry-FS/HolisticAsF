import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../../../context/AppContext";
import { getHttpErrorMessage } from "../../../utils/http";
import {
	getScheduleRequests,
	setScheduleRequestStatus,
} from "../../../data/portalData";
import { decideTimeOff, loadTimeOff } from "../../../services/hrApi";
import {
	EmptyState,
	HrHeader,
	OfflineBanner,
	Pill,
} from "./HrUi";
import { formatDate } from "./hrStyles";

const TimeOff = () => {
	const { axios } = useAppContext();
	const [requests, setRequests] = useState([]);
	const [scheduleRequests, setScheduleRequests] = useState([]);
	const [loading, setLoading] = useState(true);
	const [offline, setOffline] = useState(false);
	const [error, setError] = useState("");
	const [filter, setFilter] = useState("pending");

	useEffect(() => {
		let current = true;
		const load = async () => {
			setLoading(true);
			setError("");
			try {
				const result = await loadTimeOff(axios);
				if (!current) return;
				setRequests(result.items);
				setScheduleRequests(getScheduleRequests());
				setOffline(Boolean(result.offline));
			} catch (err) {
				if (current) setError(getHttpErrorMessage(err, "Failed to load time-off requests"));
			} finally {
				if (current) setLoading(false);
			}
		};
		load();
		return () => {
			current = false;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const filtered = useMemo(
		() => (filter === "all" ? requests : requests.filter((request) => request.status === filter)),
		[requests, filter],
	);
	const pendingCount = requests.filter((request) => request.status === "pending").length;

	const handleDecision = async (request, status) => {
		try {
			const result = await decideTimeOff(axios, request, status);
			setRequests((previous) =>
				previous.map((item) =>
					(item.id || item.requestId) === (request.id || request.requestId)
						? { ...item, ...result.item }
						: item,
				),
			);
			if (result.offline) setOffline(true);
			toast.success(`Request ${status}`);
		} catch (err) {
			toast.error(getHttpErrorMessage(err, "Failed to update request"));
		}
	};

	const handleScheduleDecision = (request, status) => {
		setScheduleRequests(setScheduleRequestStatus(request.id, status));
		toast.success(`Schedule request ${status}`);
	};

	return (
		<section className="space-y-5">
			<HrHeader
				eyebrow="Approvals"
				title="Time-off"
				accent="queue"
				description="Approve or deny requests submitted in the employee portal. Decisions appear there immediately and are stored with the HR records."
				actions={
					<span className="rounded-full border border-secondary-golden-honey/30 bg-secondary-golden-honey/10 px-3 py-1.5 text-xs font-medium text-secondary-earthy-brown">
						{pendingCount} pending
					</span>
				}
			/>
			<OfflineBanner offline={offline} />
			{error ? (
				<div className="rounded-2xl border border-semantic-error/20 bg-semantic-error/10 p-4 text-sm text-semantic-error">
					{error}
				</div>
			) : null}

			<div className="rounded-3xl border border-primary-forest-green/10 bg-primary-warm-white/75 p-4 shadow-sm backdrop-blur md:p-5">
				<div className="flex flex-wrap items-center justify-between gap-3">
					<h3 className="text-lg font-semibold tracking-tight">Leave requests</h3>
					<select
						aria-label="Filter time-off requests"
						className="w-auto rounded-xl border border-primary-forest-green/12 bg-secondary-soft-beige/70 px-3 py-2 text-sm"
						value={filter}
						onChange={(event) => setFilter(event.target.value)}
					>
						<option value="pending">Pending</option>
						<option value="all">All requests</option>
						<option value="approved">Approved</option>
						<option value="denied">Denied</option>
					</select>
				</div>
				<div className="mt-4 space-y-3">
					{loading ? (
						<p className="py-8 text-center text-sm text-primary-forest-green/60">Loading requests…</p>
					) : filtered.length === 0 ? (
						<EmptyState>No {filter === "all" ? "" : filter} time-off requests.</EmptyState>
					) : (
						filtered.map((request) => (
							<div
								key={request.id || request.requestId}
								data-testid="hr-timeoff-row"
								className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary-forest-green/10 bg-secondary-soft-beige/40 p-4"
							>
								<div className="min-w-[240px] flex-1">
									<div className="flex items-center gap-2">
										<p className="font-medium">{request.employeeName}</p>
										<Pill status={request.status} />
									</div>
									<p className="mt-1 text-sm text-primary-forest-green/70">
										{formatDate(request.startDate)} – {formatDate(request.endDate)}
									</p>
									<p className="text-xs text-primary-forest-green/55">{request.reason || "No reason provided"}</p>
								</div>
								<div className="flex flex-wrap gap-2">
									<button
										data-testid="hr-timeoff-approve"
										onClick={() => handleDecision(request, "approved")}
										disabled={request.status === "approved"}
										className="rounded-full border border-semantic-success/30 bg-semantic-success/10 px-3.5 py-1.5 text-xs font-medium text-semantic-success transition hover:bg-semantic-success/20 disabled:opacity-40"
									>
										Approve
									</button>
									<button
										data-testid="hr-timeoff-deny"
										onClick={() => handleDecision(request, "denied")}
										disabled={request.status === "denied"}
										className="rounded-full border border-semantic-error/25 bg-semantic-error/5 px-3.5 py-1.5 text-xs font-medium text-semantic-error transition hover:bg-semantic-error/10 disabled:opacity-40"
									>
										Deny
									</button>
								</div>
							</div>
						))
					)}
				</div>
			</div>

			<div className="rounded-3xl border border-primary-forest-green/10 bg-primary-warm-white/75 p-4 shadow-sm backdrop-blur md:p-5">
				<h3 className="text-lg font-semibold tracking-tight">Schedule requests</h3>
				<p className="text-xs text-primary-forest-green/55">Shift preferences and swaps submitted from the portal.</p>
				<ul className="mt-4 space-y-2">
					{scheduleRequests.length === 0 ? (
						<li><EmptyState>No schedule requests.</EmptyState></li>
					) : (
						scheduleRequests.map((request) => (
							<li key={request.id} data-testid="hr-schedule-row" className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary-forest-green/8 bg-secondary-soft-beige/40 px-4 py-3">
								<div>
									<p className="text-sm font-medium">{request.employeeName}</p>
									<p className="text-xs text-primary-forest-green/65">
										{formatDate(request.date)} · {request.detail}
									</p>
								</div>
								<div className="flex items-center gap-2">
									<Pill status={request.status} />
									<button onClick={() => handleScheduleDecision(request, "approved")} disabled={request.status === "approved"} className="rounded-full border border-primary-forest-green/15 px-2.5 py-1 text-[11px] hover:bg-primary-sage-green/15 disabled:opacity-40">Approve</button>
									<button onClick={() => handleScheduleDecision(request, "denied")} disabled={request.status === "denied"} className="rounded-full border border-primary-forest-green/15 px-2.5 py-1 text-[11px] hover:bg-primary-sage-green/15 disabled:opacity-40">Deny</button>
								</div>
							</li>
						))
					)}
				</ul>
			</div>
		</section>
	);
};

export default TimeOff;
