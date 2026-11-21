import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../../../context/AppContext";
import { getHttpErrorMessage } from "../../../utils/http";
import { toYMD } from "../../../data/hrData";
import { loadEmployees, loadPayRuns, runPayroll } from "../../../services/hrApi";
import {
	EmptyState,
	Field,
	HrHeader,
	Modal,
	OfflineBanner,
	Pill,
} from "./HrUi";
import { formatMoney, inputClass, primaryButton, secondaryButton } from "./hrStyles";

const currentPeriod = () =>
	new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

const monthStart = () => {
	const date = new Date();
	return toYMD(new Date(date.getFullYear(), date.getMonth(), 1));
};
const monthEnd = () => {
	const date = new Date();
	return toYMD(new Date(date.getFullYear(), date.getMonth() + 1, 0));
};

const Payroll = () => {
	const { axios, currency } = useAppContext();
	const [runs, setRuns] = useState([]);
	const [employees, setEmployees] = useState([]);
	const [loading, setLoading] = useState(true);
	const [offline, setOffline] = useState(false);
	const [error, setError] = useState("");
	const [filter, setFilter] = useState("all");
	const [showForm, setShowForm] = useState(false);
	const [saving, setSaving] = useState(false);
	const [form, setForm] = useState({
		employeeId: "",
		period: currentPeriod(),
		startDate: monthStart(),
		endDate: monthEnd(),
		amount: "",
		status: "pending",
		note: "",
	});

	const load = async () => {
		setLoading(true);
		setError("");
		try {
			const [runsResult, employeesResult] = await Promise.all([
				loadPayRuns(axios),
				loadEmployees(axios),
			]);
			setRuns(runsResult.items);
			setEmployees(employeesResult.items.filter((employee) => employee.active));
			setOffline(Boolean(runsResult.offline || employeesResult.offline));
			setForm((previous) => ({
				...previous,
				employeeId: previous.employeeId || employeesResult.items.find((employee) => employee.active)?.employeeId || "",
			}));
		} catch (err) {
			setError(getHttpErrorMessage(err, "Failed to load payroll"));
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		load();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const filtered = useMemo(
		() => (filter === "all" ? runs : runs.filter((run) => run.employeeId === filter)),
		[runs, filter],
	);
	const paidTotal = filtered.filter((run) => run.status === "paid").reduce((sum, run) => sum + Number(run.amount || 0), 0);
	const pendingTotal = filtered.filter((run) => run.status === "pending").reduce((sum, run) => sum + Number(run.amount || 0), 0);

	const openForm = () => {
		setForm({
			employeeId: employees[0]?.employeeId || "",
			period: currentPeriod(),
			startDate: monthStart(),
			endDate: monthEnd(),
			amount: "",
			status: "pending",
			note: "",
		});
		setShowForm(true);
	};

	const handleRun = async (event) => {
		event.preventDefault();
		if (!form.employeeId) {
			toast.error("Select an employee");
			return;
		}
		const amount = Number(form.amount);
		if (!Number.isFinite(amount) || amount <= 0) {
			toast.error("Enter a valid pay amount");
			return;
		}
		setSaving(true);
		try {
			const employee = employees.find((item) => item.employeeId === form.employeeId);
			const result = await runPayroll(axios, {
				...form,
				amount,
				employeeName: employee?.name || "",
			});
			setRuns((previous) => [result.item, ...previous]);
			if (result.offline) setOffline(true);
			setShowForm(false);
			toast.success("Payroll run recorded");
		} catch (err) {
			toast.error(getHttpErrorMessage(err, "Failed to run payroll"));
		} finally {
			setSaving(false);
		}
	};

	return (
		<section className="space-y-5">
			<HrHeader
				eyebrow="Compensation"
				title="Payroll"
				accent="history"
				description="Review pay runs by employee and record a demo payroll run."
				actions={
					<button data-testid="hr-run-payroll" onClick={openForm} className={primaryButton}>
						+ Run payroll
					</button>
				}
			/>
			<OfflineBanner offline={offline} />
			{error ? (
				<div className="rounded-2xl border border-semantic-error/20 bg-semantic-error/10 p-4 text-sm text-semantic-error">
					{error}
				</div>
			) : null}

			<div className="grid gap-4 sm:grid-cols-3">
				{[
					["Total runs", String(filtered.length)],
					["Paid", formatMoney(paidTotal, currency)],
					["Pending", formatMoney(pendingTotal, currency)],
				].map(([label, value]) => (
					<div key={label} className="rounded-2xl border border-primary-forest-green/10 bg-primary-warm-white/70 p-4 shadow-sm">
						<p className="text-[11px] uppercase tracking-wider text-primary-forest-green/50">{label}</p>
						<p className="mt-1 text-xl font-semibold">{value}</p>
					</div>
				))}
			</div>

			<div className="rounded-3xl border border-primary-forest-green/10 bg-primary-warm-white/75 p-4 shadow-sm backdrop-blur md:p-5">
				<div className="flex flex-wrap items-center justify-between gap-3">
					<h3 className="text-lg font-semibold tracking-tight">Pay run history</h3>
					<select
						data-testid="hr-payroll-filter"
						aria-label="Filter pay runs by employee"
						className={`${inputClass} w-auto min-w-[200px]`}
						value={filter}
						onChange={(event) => setFilter(event.target.value)}
					>
						<option value="all">All employees</option>
						{employees.map((employee) => (
							<option key={employee.employeeId} value={employee.employeeId}>
								{employee.name}
							</option>
						))}
					</select>
				</div>
				<div className="mt-4 overflow-x-auto">
					<table data-testid="hr-payroll-table" className="w-full min-w-[720px] text-left text-sm">
						<thead>
							<tr className="border-b border-primary-forest-green/10 text-[11px] uppercase tracking-wider text-primary-forest-green/50">
								<th className="px-3 py-2 font-medium">Employee</th>
								<th className="px-3 py-2 font-medium">Period</th>
								<th className="px-3 py-2 font-medium">Dates</th>
								<th className="px-3 py-2 font-medium">Amount</th>
								<th className="px-3 py-2 font-medium">Status</th>
								<th className="px-3 py-2 font-medium">Note</th>
							</tr>
						</thead>
						<tbody>
							{loading ? (
								<tr><td colSpan={6} className="px-3 py-10 text-center text-sm text-primary-forest-green/60">Loading pay runs…</td></tr>
							) : filtered.length === 0 ? (
								<tr><td colSpan={6} className="px-3 py-10 text-center"><EmptyState>No pay runs for this employee yet.</EmptyState></td></tr>
							) : (
								filtered.map((run) => (
									<tr key={run.id || run._id} data-testid="hr-pay-run-row" className="border-b border-primary-forest-green/8">
										<td className="px-3 py-3 font-medium">{run.employeeName}</td>
										<td className="px-3 py-3">{run.period}</td>
										<td className="px-3 py-3 text-primary-forest-green/65">
											{run.startDate || "—"} – {run.endDate || "—"}
										</td>
										<td className="px-3 py-3 font-medium">{formatMoney(run.amount, currency)}</td>
										<td className="px-3 py-3"><Pill status={run.status} /></td>
										<td className="max-w-[280px] truncate px-3 py-3 text-primary-forest-green/60">{run.note || "—"}</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>

			{showForm ? (
				<Modal
					testId="hr-payroll-form"
					title="Run payroll"
					subtitle="Demo action — creates a pay-run record for the selected employee."
					onClose={() => setShowForm(false)}
				>
					<form onSubmit={handleRun} className="space-y-4">
						<Field label="Employee">
							<select data-testid="hr-payrun-employee" className={inputClass} value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} required>
								<option value="">Select employee</option>
								{employees.map((employee) => (
									<option key={employee.employeeId} value={employee.employeeId}>{employee.name}</option>
								))}
							</select>
						</Field>
						<div className="grid gap-3 md:grid-cols-2">
							<Field label="Pay period">
								<input data-testid="hr-payrun-period" className={inputClass} value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} required />
							</Field>
							<Field label="Amount">
								<input data-testid="hr-payrun-amount" type="number" min="0" step="0.01" className={inputClass} value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="0.00" required />
							</Field>
							<Field label="Start date">
								<input type="date" className={inputClass} value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
							</Field>
							<Field label="End date">
								<input type="date" className={inputClass} value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
							</Field>
						</div>
						<Field label="Status">
							<select data-testid="hr-payrun-status" className={inputClass} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
								<option value="pending">Pending</option>
								<option value="paid">Paid</option>
							</select>
						</Field>
						<Field label="Note">
							<textarea rows={2} className={inputClass} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="e.g. Regular hourly pay — 80 hours." />
						</Field>
						<div className="flex justify-end gap-2">
							<button type="button" onClick={() => setShowForm(false)} className={secondaryButton}>Cancel</button>
							<button type="submit" data-testid="hr-save-payrun" disabled={saving} className={primaryButton}>
								{saving ? "Recording…" : "Record pay run"}
							</button>
						</div>
					</form>
				</Modal>
			) : null}
		</section>
	);
};

export default Payroll;
