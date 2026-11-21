import React, { useState } from "react";
import toast from "react-hot-toast";
import { demoShifts } from "../../data/employee";
import {
	addScheduleRequest,
	addTimeOffRequest,
	getAvailability,
	getScheduleRequests,
	getTimeOffRequests,
	setAvailability,
} from "../../data/portalData";

const toYMD = (daysFromNow = 0) => {
	const date = new Date();
	date.setDate(date.getDate() + daysFromNow);
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

const formatDate = (value) => {
	if (!value) return "—";
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
};

const StatusPill = ({ status }) => (
	<span className="rounded-full bg-secondary-golden-honey/15 px-2 py-0.5 text-[11px] font-medium capitalize text-secondary-earthy-brown">
		{status || "pending"}
	</span>
);

/** Upcoming shifts, schedule/time-off requests, and availability toggle. */
const SchedulePanel = ({ role, employeeId, employeeName, shifts }) => {
	const isEmployee = role === "employee";
	const id = employeeId || "demo-employee-1";
	const name = employeeName || "Jordan Rivera";

	const [requests, setRequests] = useState(() => getScheduleRequests(isEmployee ? id : null));
	const [timeOff, setTimeOff] = useState(() => getTimeOffRequests(isEmployee ? id : null));
	const [available, setAvailable] = useState(() => getAvailability(id));
	const [scheduleForm, setScheduleForm] = useState({ date: toYMD(1), detail: "" });
	const [timeOffForm, setTimeOffForm] = useState({
		startDate: toYMD(7),
		endDate: toYMD(9),
		reason: "",
	});

	const upcoming = shifts && shifts.length ? shifts : demoShifts();

	const submitScheduleRequest = (event) => {
		event.preventDefault();
		if (!scheduleForm.date || !scheduleForm.detail.trim()) {
			toast.error("Choose a date and add a detail");
			return;
		}
		addScheduleRequest({
			employeeId: id,
			employeeName: name,
			type: "shift",
			date: scheduleForm.date,
			detail: scheduleForm.detail.trim(),
		});
		setRequests(getScheduleRequests(isEmployee ? id : null));
		setScheduleForm({ date: toYMD(1), detail: "" });
		toast.success("Schedule request submitted");
	};

	const submitTimeOff = (event) => {
		event.preventDefault();
		if (!timeOffForm.startDate || !timeOffForm.endDate) {
			toast.error("Choose start and end dates");
			return;
		}
		addTimeOffRequest({
			employeeId: id,
			employeeName: name,
			startDate: timeOffForm.startDate,
			endDate: timeOffForm.endDate,
			reason: timeOffForm.reason.trim(),
		});
		setTimeOff(getTimeOffRequests(isEmployee ? id : null));
		setTimeOffForm({ startDate: toYMD(7), endDate: toYMD(9), reason: "" });
		toast.success("Time off request submitted");
	};

	const toggleAvailability = () => {
		const next = !available;
		setAvailable(next);
		setAvailability(id, next);
		toast.success(next ? "You are marked available" : "You are marked unavailable");
	};

	return (
		<div className="space-y-6">
			<section className="rounded-3xl border border-primary-forest-green/10 bg-primary-warm-white/75 p-4 shadow-sm backdrop-blur md:p-5">
				<h3 className="text-lg font-semibold tracking-tight">Upcoming shifts</h3>
				<p className="text-xs text-primary-forest-green/55">
					Your next scheduled shifts and appointments
				</p>
				<ul className="mt-4 space-y-2">
					{upcoming.slice(0, 5).map((shift) => (
						<li
							key={shift._id || `${shift.date}-${shift.startTime}`}
							className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-primary-forest-green/8 bg-secondary-soft-beige/50 px-3.5 py-2.5"
						>
							<div>
								<p className="text-sm font-medium">{formatDate(shift.date)}</p>
								<p className="text-xs text-primary-forest-green/60">
									{shift.startTime}–{shift.endTime}
									{shift.role ? ` · ${shift.role}` : ""}
								</p>
							</div>
							<span className="text-xs text-primary-forest-green/55">
								{shift.location || "HolisticAF Store"}
							</span>
						</li>
					))}
				</ul>
			</section>

			{isEmployee ? (
				<section className="rounded-3xl border border-primary-forest-green/10 bg-primary-warm-white/75 p-4 shadow-sm backdrop-blur md:p-5">
					<div className="flex items-center justify-between gap-3">
						<div>
							<h3 className="text-lg font-semibold tracking-tight">Availability</h3>
							<p className="text-xs text-primary-forest-green/55">
								Let the team know if you can take shifts
							</p>
						</div>
						<button
							role="switch"
							aria-checked={available}
							aria-label="Availability"
							data-testid="availability-toggle"
							onClick={toggleAvailability}
							className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition ${
								available
									? "border-semantic-success/30 bg-semantic-success/10 text-semantic-success"
									: "border-primary-forest-green/15 bg-secondary-soft-beige/60 text-primary-forest-green/60"
							}`}
						>
							<span
								className={`h-2.5 w-2.5 rounded-full ${
									available ? "bg-semantic-success" : "bg-primary-forest-green/40"
								}`}
							/>
							{available ? "Available" : "Unavailable"}
						</button>
					</div>
				</section>
			) : null}

			<section
				data-testid="schedule-requests"
				className="rounded-3xl border border-primary-forest-green/10 bg-primary-warm-white/75 p-4 shadow-sm backdrop-blur md:p-5"
			>
				<h3 className="text-lg font-semibold tracking-tight">Schedule requests</h3>
				<p className="text-xs text-primary-forest-green/55">
					{isEmployee
						? "Ask for a specific shift or swap"
						: "All requests submitted by the team"}
				</p>
				{isEmployee ? (
					<form
						onSubmit={submitScheduleRequest}
						className="mt-4 flex flex-wrap gap-2 rounded-2xl border border-primary-forest-green/10 bg-secondary-soft-beige/40 p-3"
					>
						<input
							aria-label="Request date"
							type="date"
							value={scheduleForm.date}
							onChange={(event) =>
								setScheduleForm((previous) => ({
									...previous,
									date: event.target.value,
								}))
							}
							className="rounded-xl border border-primary-forest-green/10 bg-primary-warm-white/80 px-3 py-2 text-sm"
						/>
						<input
							aria-label="Schedule request detail"
							placeholder="e.g. Prefer morning shift"
							value={scheduleForm.detail}
							onChange={(event) =>
								setScheduleForm((previous) => ({
									...previous,
									detail: event.target.value,
								}))
							}
							className="min-w-[180px] flex-1 rounded-xl border border-primary-forest-green/10 bg-primary-warm-white/80 px-3 py-2 text-sm"
						/>
						<button
							type="submit"
							className="rounded-full bg-primary-forest-green px-4 py-2 text-sm font-medium text-primary-cream"
						>
							Submit request
						</button>
					</form>
				) : null}
				<ul className="mt-4 space-y-2">
					{requests.length === 0 ? (
						<li className="rounded-2xl border border-dashed border-primary-forest-green/15 p-6 text-center text-sm text-primary-forest-green/60">
							No schedule requests.
						</li>
					) : (
						requests.map((request) => (
							<li
								key={request.id}
								className="flex items-center justify-between gap-2 rounded-2xl border border-primary-forest-green/8 bg-secondary-soft-beige/40 px-3.5 py-2.5"
							>
								<div>
									<p className="text-sm font-medium">{request.employeeName}</p>
									<p className="text-xs text-primary-forest-green/60">
										{formatDate(request.date)} · {request.detail}
									</p>
								</div>
								<StatusPill status={request.status} />
							</li>
						))
					)}
				</ul>
			</section>

			<section
				data-testid="timeoff-requests"
				className="rounded-3xl border border-primary-forest-green/10 bg-primary-warm-white/75 p-4 shadow-sm backdrop-blur md:p-5"
			>
				<h3 className="text-lg font-semibold tracking-tight">Time off requests</h3>
				<p className="text-xs text-primary-forest-green/55">
					{isEmployee ? "Request time away from the floor" : "All time off requests"}
				</p>
				{isEmployee ? (
					<form
						onSubmit={submitTimeOff}
						className="mt-4 flex flex-wrap gap-2 rounded-2xl border border-primary-forest-green/10 bg-secondary-soft-beige/40 p-3"
					>
						<input
							aria-label="Time off start"
							type="date"
							value={timeOffForm.startDate}
							onChange={(event) =>
								setTimeOffForm((previous) => ({
									...previous,
									startDate: event.target.value,
								}))
							}
							className="rounded-xl border border-primary-forest-green/10 bg-primary-warm-white/80 px-3 py-2 text-sm"
						/>
						<input
							aria-label="Time off end"
							type="date"
							value={timeOffForm.endDate}
							onChange={(event) =>
								setTimeOffForm((previous) => ({
									...previous,
									endDate: event.target.value,
								}))
							}
							className="rounded-xl border border-primary-forest-green/10 bg-primary-warm-white/80 px-3 py-2 text-sm"
						/>
						<input
							aria-label="Time off reason"
							placeholder="Reason (optional)"
							value={timeOffForm.reason}
							onChange={(event) =>
								setTimeOffForm((previous) => ({
									...previous,
									reason: event.target.value,
								}))
							}
							className="min-w-[140px] flex-1 rounded-xl border border-primary-forest-green/10 bg-primary-warm-white/80 px-3 py-2 text-sm"
						/>
						<button
							type="submit"
							className="rounded-full bg-primary-forest-green px-4 py-2 text-sm font-medium text-primary-cream"
						>
							Submit request
						</button>
					</form>
				) : null}
				<ul className="mt-4 space-y-2">
					{timeOff.length === 0 ? (
						<li className="rounded-2xl border border-dashed border-primary-forest-green/15 p-6 text-center text-sm text-primary-forest-green/60">
							No time off requests.
						</li>
					) : (
						timeOff.map((request) => (
							<li
								key={request.id}
								className="flex items-center justify-between gap-2 rounded-2xl border border-primary-forest-green/8 bg-secondary-soft-beige/40 px-3.5 py-2.5"
							>
								<div>
									<p className="text-sm font-medium">{request.employeeName}</p>
									<p className="text-xs text-primary-forest-green/60">
										{formatDate(request.startDate)} – {formatDate(request.endDate)}
										{request.reason ? ` · ${request.reason}` : ""}
									</p>
								</div>
								<StatusPill status={request.status} />
							</li>
						))
					)}
				</ul>
			</section>
		</div>
	);
};

export default SchedulePanel;
