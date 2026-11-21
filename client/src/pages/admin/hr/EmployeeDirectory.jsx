import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../../../context/AppContext";
import { getHttpErrorMessage } from "../../../utils/http";
import { toYMD } from "../../../data/hrData";
import {
	addNote,
	loadEmployees,
	loadNotes,
	loadPayRuns,
	loadSettings,
	saveEmployee,
	setEmployeeStatus,
} from "../../../services/hrApi";
import {
	EmptyState,
	Field,
	HrHeader,
	Modal,
	OfflineBanner,
	Pill,
} from "./HrUi";
import { formatDate, formatMoney, inputClass, primaryButton, secondaryButton } from "./hrStyles";

const emptyForm = () => ({
	employeeId: `emp-${Date.now()}`,
	name: "",
	position: "Store Associate",
	department: "Sales floor",
	email: "",
	phone: "",
	address: "",
	rate: "",
	payType: "hourly",
	color: "#1e4d43",
	active: true,
	notes: "",
});

const EmployeeDirectory = () => {
	const { axios, currency } = useAppContext();
	const [employees, setEmployees] = useState([]);
	const [departments, setDepartments] = useState([]);
	const [roles, setRoles] = useState([]);
	const [loading, setLoading] = useState(true);
	const [offline, setOffline] = useState(false);
	const [error, setError] = useState("");
	const [search, setSearch] = useState("");
	const [departmentFilter, setDepartmentFilter] = useState("all");
	const [statusFilter, setStatusFilter] = useState("all");
	const [selectedId, setSelectedId] = useState(null);
	const [form, setForm] = useState(null);
	const [editingId, setEditingId] = useState(null);
	const [saving, setSaving] = useState(false);
	const [payRuns, setPayRuns] = useState([]);
	const [notes, setNotes] = useState([]);
	const [noteText, setNoteText] = useState("");
	const [noteAuthor, setNoteAuthor] = useState("Store Manager");

	const load = async () => {
		setLoading(true);
		setError("");
		try {
			const [employeesResult, settingsResult] = await Promise.all([
				loadEmployees(axios),
				loadSettings(axios),
			]);
			setEmployees(employeesResult.items);
			setOffline(Boolean(employeesResult.offline || settingsResult.offline));
			setDepartments(settingsResult.settings.departments || []);
			setRoles(settingsResult.settings.roles || []);
		} catch (err) {
			setError(getHttpErrorMessage(err, "Failed to load employees"));
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		load();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const selected = employees.find((employee) => employee.employeeId === selectedId) || null;

	useEffect(() => {
		if (!selected) {
			setPayRuns([]);
			setNotes([]);
			return;
		}
		let current = true;
		Promise.all([loadPayRuns(axios, selected.employeeId), loadNotes(axios, selected.employeeId)])
			.then(([runsResult, notesResult]) => {
				if (!current) return;
				setPayRuns(runsResult.items);
				setNotes(notesResult.items);
				if (runsResult.offline || notesResult.offline) setOffline(true);
			})
			.catch((err) => toast.error(getHttpErrorMessage(err, "Failed to load employee details")));
		return () => {
			current = false;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedId, selected?.status]);

	const filtered = useMemo(() => {
		const term = search.trim().toLowerCase();
		return employees.filter((employee) => {
			const matchesTerm =
				!term ||
				[
					employee.name,
					employee.position,
					employee.department,
					employee.email,
					employee.phone,
				]
					.join(" ")
					.toLowerCase()
					.includes(term);
			const matchesDepartment =
				departmentFilter === "all" || employee.department === departmentFilter;
			const matchesStatus =
				statusFilter === "all" ||
				employee.active === (statusFilter === "active");
			return matchesTerm && matchesDepartment && matchesStatus;
		});
	}, [employees, search, departmentFilter, statusFilter]);

	const departmentOptions = useMemo(
		() =>
			Array.from(
				new Set([...departments, ...employees.map((employee) => employee.department).filter(Boolean)]),
			).sort(),
		[departments, employees],
	);
	const roleOptions = useMemo(
		() =>
			Array.from(
				new Set([...roles, ...employees.map((employee) => employee.position).filter(Boolean)]),
			).sort(),
		[roles, employees],
	);

	const openAdd = () => {
		setEditingId(null);
		setForm(emptyForm());
	};

	const openEdit = (employee) => {
		setEditingId(employee.employeeId);
		setForm({
			employeeId: employee.employeeId,
			name: employee.name || "",
			position: employee.position || "Staff",
			department: employee.department || "Sales floor",
			email: employee.email || "",
			phone: employee.phone || "",
			address: employee.address || "",
			rate: employee.rate ?? "",
			payType: employee.payType || "hourly",
			color: employee.color || "#1e4d43",
			active: Boolean(employee.active),
			notes: employee.notes || "",
		});
	};

	const handleSave = async (event) => {
		event.preventDefault();
		if (!form.name.trim()) {
			toast.error("Employee name is required");
			return;
		}
		if (form.email && !/^[^\s@]+@[^\s@]+$/.test(form.email)) {
			toast.error("Enter a valid email address");
			return;
		}
		if (form.rate === "" || Number(form.rate) < 0 || !Number.isFinite(Number(form.rate))) {
			toast.error("Enter a valid pay rate");
			return;
		}
		setSaving(true);
		try {
			const existing = employees.find((item) => item.employeeId === editingId);
			const payload = {
				...form,
				_id: existing?._id,
				rate: Number(form.rate),
			};
			const result = await saveEmployee(axios, payload, Boolean(editingId));
			const item = result.item;
			setEmployees((prev) =>
				prev.some((employee) => employee.employeeId === item.employeeId)
					? prev.map((employee) => (employee.employeeId === item.employeeId ? { ...employee, ...item } : employee))
					: [item, ...prev],
			);
			if (result.offline) setOffline(true);
			toast.success(editingId ? "Employee updated" : "Employee added");
			setForm(null);
			setEditingId(null);
		} catch (err) {
			toast.error(getHttpErrorMessage(err, "Failed to save employee"));
		} finally {
			setSaving(false);
		}
	};

	const handleStatus = async (employee) => {
		const active = !employee.active;
		if (!active && !window.confirm(`Deactivate ${employee.name}? Their record and history are kept.`)) {
			return;
		}
		try {
			const result = await setEmployeeStatus(axios, employee, active);
			setEmployees((prev) =>
				prev.map((item) =>
					item.employeeId === employee.employeeId ? { ...item, ...result.item } : item,
				),
			);
			if (result.offline) setOffline(true);
			toast.success(active ? `${employee.name} activated` : `${employee.name} deactivated`);
		} catch (err) {
			toast.error(getHttpErrorMessage(err, "Failed to update status"));
		}
	};

	const handleAddNote = async (event) => {
		event.preventDefault();
		if (!selected || !noteText.trim()) {
			toast.error("Write a note first");
			return;
		}
		try {
			const result = await addNote(axios, {
				employeeId: selected.employeeId,
				employeeName: selected.name,
				author: noteAuthor.trim() || "Store Manager",
				date: toYMD(new Date()),
				text: noteText.trim(),
			});
			setNotes((prev) => [result.item, ...prev]);
			setNoteText("");
			if (result.offline) setOffline(true);
			toast.success("Performance note added");
		} catch (err) {
			toast.error(getHttpErrorMessage(err, "Failed to add note"));
		}
	};

	return (
		<section className="space-y-5">
			<HrHeader
				eyebrow="People ops"
				title="Employee"
				accent="directory"
				description="Search the team, open a profile for details and history, or add and manage records."
				actions={
					<button data-testid="hr-add-employee" onClick={openAdd} className={primaryButton}>
						+ Add employee
					</button>
				}
			/>

			<OfflineBanner offline={offline} />
			{error ? (
				<div className="rounded-2xl border border-semantic-error/20 bg-semantic-error/10 p-4 text-sm text-semantic-error">
					{error}
				</div>
			) : null}

			<div className="rounded-3xl border border-primary-forest-green/10 bg-primary-warm-white/75 p-4 shadow-sm backdrop-blur md:p-5">
				<div className="flex flex-wrap items-center gap-3">
					<input
						data-testid="hr-directory-search"
						aria-label="Search employees"
						value={search}
						onChange={(event) => setSearch(event.target.value)}
						placeholder="Search name, role, email or phone…"
						className={`${inputClass} min-w-[220px] flex-1`}
					/>
					<select
						data-testid="hr-dept-filter"
						aria-label="Filter by department"
						value={departmentFilter}
						onChange={(event) => setDepartmentFilter(event.target.value)}
						className={`${inputClass} w-auto min-w-[160px]`}
					>
						<option value="all">All departments</option>
						{departmentOptions.map((department) => (
							<option key={department} value={department}>
								{department}
							</option>
						))}
					</select>
					<select
						data-testid="hr-status-filter"
						aria-label="Filter by status"
						value={statusFilter}
						onChange={(event) => setStatusFilter(event.target.value)}
						className={`${inputClass} w-auto min-w-[130px]`}
					>
						<option value="all">All statuses</option>
						<option value="active">Active</option>
						<option value="inactive">Inactive</option>
					</select>
					<span className="ml-auto text-xs text-primary-forest-green/55">
						{filtered.length} of {employees.length} employees
					</span>
				</div>

				<div className="mt-5 overflow-x-auto">
					<table data-testid="hr-directory-table" className="w-full min-w-[1100px] text-left text-sm">
						<thead>
							<tr className="border-b border-primary-forest-green/10 text-[11px] uppercase tracking-wider text-primary-forest-green/50">
								<th className="px-3 py-2 font-medium">Name</th>
								<th className="px-3 py-2 font-medium">Role / position</th>
								<th className="px-3 py-2 font-medium">Department</th>
								<th className="px-3 py-2 font-medium">Email</th>
								<th className="px-3 py-2 font-medium">Phone</th>
								<th className="px-3 py-2 font-medium">Address</th>
								<th className="px-3 py-2 font-medium">Pay / rate</th>
								<th className="px-3 py-2 font-medium">Status</th>
								<th className="px-3 py-2 font-medium">Actions</th>
							</tr>
						</thead>
						<tbody>
							{loading ? (
								<tr>
									<td colSpan={9} className="px-3 py-10 text-center text-sm text-primary-forest-green/60">
										Loading employees…
									</td>
								</tr>
							) : filtered.length === 0 ? (
								<tr>
									<td colSpan={9} className="px-3 py-10 text-center">
										<EmptyState>No employees match those filters.</EmptyState>
									</td>
								</tr>
							) : (
								filtered.map((employee) => (
									<tr
										key={employee.employeeId}
										data-testid="hr-employee-row"
										onClick={() => setSelectedId(employee.employeeId)}
										className="cursor-pointer border-b border-primary-forest-green/8 transition hover:bg-primary-sage-green/10"
									>
										<td className="px-3 py-3">
											<button
												type="button"
												onClick={(event) => {
													event.stopPropagation();
													setSelectedId(employee.employeeId);
												}}
												className="flex items-center gap-2 text-left font-medium hover:underline"
											>
												<span
													className="h-2.5 w-2.5 shrink-0 rounded-full"
													style={{ backgroundColor: employee.color || "#1e4d43" }}
												/>
												{employee.name}
											</button>
										</td>
										<td className="px-3 py-3 text-primary-forest-green/75">{employee.position}</td>
										<td className="px-3 py-3 text-primary-forest-green/75">{employee.department}</td>
										<td className="px-3 py-3 text-primary-forest-green/70">{employee.email || "—"}</td>
										<td className="px-3 py-3 text-primary-forest-green/70">{employee.phone || "—"}</td>
										<td className="max-w-[220px] truncate px-3 py-3 text-primary-forest-green/70">
											{employee.address || "—"}
										</td>
										<td className="whitespace-nowrap px-3 py-3 text-primary-forest-green/80">
											{formatMoney(employee.rate, currency)}
											<span className="text-xs text-primary-forest-green/50">
												/{employee.payType === "salary" ? "yr" : "hr"}
											</span>
										</td>
										<td className="px-3 py-3">
											<Pill status={employee.active ? "active" : "inactive"} />
										</td>
										<td className="px-3 py-3">
											<div className="flex flex-wrap gap-1.5">
												<button
													type="button"
													onClick={(event) => {
														event.stopPropagation();
														openEdit(employee);
													}}
													className="rounded-full border border-primary-forest-green/15 px-2.5 py-1 text-xs hover:bg-primary-sage-green/15"
												>
													Edit
												</button>
												<button
													type="button"
													data-testid={employee.active ? "hr-deactivate" : "hr-activate"}
													onClick={(event) => {
														event.stopPropagation();
														handleStatus(employee);
													}}
													className={`rounded-full border px-2.5 py-1 text-xs hover:bg-primary-sage-green/15 ${
														employee.active
															? "border-secondary-golden-honey/30 text-secondary-earthy-brown"
															: "border-semantic-success/30 text-semantic-success"
													}`}
												>
													{employee.active ? "Deactivate" : "Activate"}
												</button>
											</div>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>

			{/* Employee detail drawer */}
			{selected ? (
				<div className="fixed inset-0 z-40 flex justify-end bg-primary-forest-green/35 backdrop-blur-sm" onMouseDown={(event) => {
					if (event.target === event.currentTarget) setSelectedId(null);
				}}>
					<aside
						data-testid="hr-employee-detail"
						role="dialog"
						aria-modal="true"
						aria-label={`${selected.name} details`}
						className="h-full w-full max-w-xl overflow-y-auto border-l border-primary-forest-green/10 bg-primary-warm-white p-5 shadow-2xl md:p-6"
					>
						<div className="flex items-start justify-between gap-3">
							<div>
								<p className="text-xs uppercase tracking-wider text-primary-forest-green/50">
									Employee profile
								</p>
								<h3 className="mt-1 text-xl font-semibold tracking-tight">{selected.name}</h3>
								<p className="text-sm text-primary-forest-green/65">
									{selected.position} · {selected.department}
								</p>
							</div>
							<button
								data-testid="hr-detail-close"
								onClick={() => setSelectedId(null)}
								aria-label="Close details"
								className="rounded-full border border-primary-forest-green/15 px-2.5 py-1 text-sm hover:bg-secondary-soft-beige"
							>
								✕
							</button>
						</div>

						<div className="mt-5 grid grid-cols-2 gap-3 text-sm">
							{[
								["Email", selected.email],
								["Phone", selected.phone],
								["Address", selected.address],
								["Pay rate", `${formatMoney(selected.rate, currency)}/${selected.payType === "salary" ? "yr" : "hr"}`],
								["Status", selected.active ? "Active" : "Inactive"],
								["Employee ID", selected.employeeId],
							].map(([label, value]) => (
								<div key={label} className="rounded-2xl border border-primary-forest-green/10 bg-secondary-soft-beige/40 p-3">
									<p className="text-[11px] uppercase tracking-wider text-primary-forest-green/50">{label}</p>
									<p className="mt-1 break-words font-medium">{value || "—"}</p>
								</div>
							))}
						</div>

						<div className="mt-5 flex flex-wrap gap-2">
							<button onClick={() => { setSelectedId(null); openEdit(selected); }} className={secondaryButton}>
								Edit details
							</button>
							<button
								data-testid={selected.active ? "hr-deactivate" : "hr-activate"}
								onClick={() => handleStatus(selected)}
								className={secondaryButton}
							>
								{selected.active ? "Deactivate" : "Activate"}
							</button>
						</div>

						<div className="mt-6">
							<h4 className="text-sm font-semibold">Pay history</h4>
							{payRuns.length === 0 ? (
								<p className="mt-2 text-sm text-primary-forest-green/60">No pay runs yet.</p>
							) : (
								<ul className="mt-2 space-y-2">
									{payRuns.slice(0, 5).map((run) => (
										<li key={run.id || run._id} className="flex items-center justify-between rounded-xl border border-primary-forest-green/10 px-3 py-2 text-sm">
											<span>{run.period}</span>
											<span className="flex items-center gap-2">
												{formatMoney(run.amount, currency)} <Pill status={run.status} />
											</span>
										</li>
									))}
								</ul>
							)}
						</div>

						<div className="mt-6">
							<h4 className="text-sm font-semibold">Performance notes</h4>
							<form onSubmit={handleAddNote} className="mt-3 space-y-2 rounded-2xl border border-primary-forest-green/10 bg-secondary-soft-beige/40 p-3">
								<textarea
									data-testid="hr-note-text"
									aria-label="Performance note text"
									rows={3}
									value={noteText}
									onChange={(event) => setNoteText(event.target.value)}
									placeholder="What did this employee do well? What should they work on?"
									className={inputClass}
								/>
								<div className="flex flex-wrap items-center gap-2">
									<input
										aria-label="Note author"
										value={noteAuthor}
										onChange={(event) => setNoteAuthor(event.target.value)}
										className={`${inputClass} w-auto flex-1`}
									/>
									<button data-testid="hr-add-note" type="submit" className={primaryButton}>
										Add note
									</button>
								</div>
							</form>
							<ul className="mt-3 space-y-2">
								{notes.length === 0 ? (
									<li className="text-sm text-primary-forest-green/60">No performance notes yet.</li>
								) : (
									notes.map((note) => (
										<li key={note.id || note._id} className="rounded-2xl border border-primary-forest-green/10 bg-primary-warm-white/80 p-3 text-sm">
											<p className="text-xs text-primary-forest-green/55">
												{note.author} · {formatDate(note.date)}
											</p>
											<p className="mt-1 leading-relaxed">{note.text}</p>
										</li>
									))
								)}
							</ul>
						</div>
					</aside>
				</div>
			) : null}

			{/* Add / edit employee modal */}
			{form ? (
				<Modal
					wide
					testId="hr-employee-form"
					title={editingId ? "Edit employee" : "Add employee"}
					subtitle="Pay and contact details are visible to admins only."
					onClose={() => { setForm(null); setEditingId(null); }}
				>
					<form onSubmit={handleSave} className="space-y-4">
						<div className="grid gap-3 md:grid-cols-2">
							<Field label="Full name">
								<input data-testid="hr-form-name" className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
							</Field>
							<Field label="Employee ID" hint="Stable identifier used across the portal.">
								<input data-testid="hr-form-employee-id" className={inputClass} value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} required />
							</Field>
							<Field label="Role / position">
								<select data-testid="hr-form-position" className={inputClass} value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })}>
									{roleOptions.map((role) => <option key={role} value={role}>{role}</option>)}
								</select>
							</Field>
							<Field label="Department">
								<select data-testid="hr-form-department" className={inputClass} value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}>
									{departmentOptions.map((department) => <option key={department} value={department}>{department}</option>)}
								</select>
							</Field>
							<Field label="Email">
								<input data-testid="hr-form-email" type="email" className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
							</Field>
							<Field label="Phone">
								<input data-testid="hr-form-phone" className={inputClass} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
							</Field>
							<Field label="Address" className="md:col-span-2">
								<input data-testid="hr-form-address" className={inputClass} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
							</Field>
							<Field label="Pay rate">
								<input data-testid="hr-form-rate" type="number" min="0" step="0.01" className={inputClass} value={form.rate} onChange={(e) => setForm({ ...form, rate: e.target.value })} required />
							</Field>
							<Field label="Pay type">
								<select data-testid="hr-form-pay-type" className={inputClass} value={form.payType} onChange={(e) => setForm({ ...form, payType: e.target.value })}>
									<option value="hourly">Hourly</option>
									<option value="salary">Salary</option>
								</select>
							</Field>
							<Field label="Color">
								<input type="color" className="h-[42px] w-full rounded-xl border border-primary-forest-green/12 bg-secondary-soft-beige/70 p-1" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
							</Field>
							<label className="flex items-end gap-2 pb-3 text-sm">
								<input type="checkbox" data-testid="hr-form-active" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
								Active employee
							</label>
							<Field label="Internal notes" className="md:col-span-2">
								<textarea rows={2} className={inputClass} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
							</Field>
						</div>
						<div className="flex justify-end gap-2">
							<button type="button" onClick={() => { setForm(null); setEditingId(null); }} className={secondaryButton}>Cancel</button>
							<button type="submit" data-testid="hr-save-employee" disabled={saving} className={primaryButton}>
								{saving ? "Saving…" : editingId ? "Save changes" : "Add employee"}
							</button>
						</div>
					</form>
				</Modal>
			) : null}
		</section>
	);
};

export default EmployeeDirectory;
