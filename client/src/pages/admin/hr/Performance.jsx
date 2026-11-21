import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../../../context/AppContext";
import { getHttpErrorMessage } from "../../../utils/http";
import { toYMD } from "../../../data/hrData";
import { addNote, loadEmployees, loadNotes } from "../../../services/hrApi";
import {
	EmptyState,
	Field,
	HrHeader,
	Modal,
	OfflineBanner,
} from "./HrUi";
import { formatDate, inputClass, primaryButton, secondaryButton } from "./hrStyles";

const Performance = () => {
	const { axios } = useAppContext();
	const [notes, setNotes] = useState([]);
	const [employees, setEmployees] = useState([]);
	const [loading, setLoading] = useState(true);
	const [offline, setOffline] = useState(false);
	const [error, setError] = useState("");
	const [filter, setFilter] = useState("all");
	const [showForm, setShowForm] = useState(false);
	const [saving, setSaving] = useState(false);
	const [form, setForm] = useState({
		employeeId: "",
		author: "Store Manager",
		date: toYMD(new Date()),
		text: "",
	});

	useEffect(() => {
		let current = true;
		const load = async () => {
			setLoading(true);
			setError("");
			try {
				const [notesResult, employeesResult] = await Promise.all([
					loadNotes(axios),
					loadEmployees(axios),
				]);
				if (!current) return;
				setNotes(notesResult.items);
				setEmployees(employeesResult.items);
				setOffline(Boolean(notesResult.offline || employeesResult.offline));
				setForm((previous) => ({
					...previous,
					employeeId: previous.employeeId || employeesResult.items[0]?.employeeId || "",
				}));
			} catch (err) {
				if (current) setError(getHttpErrorMessage(err, "Failed to load performance notes"));
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
		() => (filter === "all" ? notes : notes.filter((note) => note.employeeId === filter)),
		[notes, filter],
	);

	const openForm = () => {
		setForm({
			employeeId: employees[0]?.employeeId || "",
			author: "Store Manager",
			date: toYMD(new Date()),
			text: "",
		});
		setShowForm(true);
	};

	const handleAdd = async (event) => {
		event.preventDefault();
		if (!form.employeeId || !form.text.trim()) {
			toast.error("Select an employee and write a note");
			return;
		}
		setSaving(true);
		try {
			const employee = employees.find((item) => item.employeeId === form.employeeId);
			const result = await addNote(axios, { ...form, employeeName: employee?.name || "" });
			setNotes((previous) => [result.item, ...previous]);
			if (result.offline) setOffline(true);
			setShowForm(false);
			toast.success("Performance note added");
		} catch (err) {
			toast.error(getHttpErrorMessage(err, "Failed to add note"));
		} finally {
			setSaving(false);
		}
	};

	return (
		<section className="space-y-5">
			<HrHeader
				eyebrow="Development"
				title="Performance"
				accent="notes"
				description="A running log of manager feedback, with author and date on every entry."
				actions={
					<button data-testid="hr-performance-add" onClick={openForm} className={primaryButton}>
						+ Add note
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
				<div className="flex flex-wrap items-center justify-between gap-3">
					<h3 className="text-lg font-semibold tracking-tight">All notes</h3>
					<select
						aria-label="Filter notes by employee"
						className={`${inputClass} w-auto min-w-[200px]`}
						value={filter}
						onChange={(event) => setFilter(event.target.value)}
					>
						<option value="all">All employees</option>
						{employees.map((employee) => (
							<option key={employee.employeeId} value={employee.employeeId}>{employee.name}</option>
						))}
					</select>
				</div>
				<div className="mt-4 grid gap-3 lg:grid-cols-2">
					{loading ? (
						<p className="col-span-full py-8 text-center text-sm text-primary-forest-green/60">Loading notes…</p>
					) : filtered.length === 0 ? (
						<div className="col-span-full"><EmptyState>No performance notes yet.</EmptyState></div>
					) : (
						filtered.map((note) => (
							<article key={note.id || note._id} data-testid="hr-performance-note" className="rounded-2xl border border-primary-forest-green/10 bg-secondary-soft-beige/45 p-4">
								<div className="flex items-start justify-between gap-3">
									<div>
										<p className="font-medium">{note.employeeName || note.employeeId}</p>
										<p className="text-xs text-primary-forest-green/55">
											{note.author} · {formatDate(note.date)}
										</p>
									</div>
								</div>
								<p className="mt-2 text-sm leading-relaxed text-primary-forest-green/80">{note.text}</p>
							</article>
						))
					)}
				</div>
			</div>

			{showForm ? (
				<Modal
					testId="hr-performance-form"
					title="Add performance note"
					subtitle="Notes are visible to admins and included on the employee's profile."
					onClose={() => setShowForm(false)}
				>
					<form onSubmit={handleAdd} className="space-y-4">
						<Field label="Employee">
							<select className={inputClass} value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} required>
								<option value="">Select employee</option>
								{employees.map((employee) => (
									<option key={employee.employeeId} value={employee.employeeId}>{employee.name}</option>
								))}
							</select>
						</Field>
						<div className="grid gap-3 md:grid-cols-2">
							<Field label="Author">
								<input className={inputClass} value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
							</Field>
							<Field label="Date">
								<input type="date" className={inputClass} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
							</Field>
						</div>
						<Field label="Note">
							<textarea data-testid="hr-performance-text" rows={4} className={inputClass} value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} placeholder="Describe what went well and what to improve…" required />
						</Field>
						<div className="flex justify-end gap-2">
							<button type="button" onClick={() => setShowForm(false)} className={secondaryButton}>Cancel</button>
							<button type="submit" data-testid="hr-save-note" disabled={saving} className={primaryButton}>
								{saving ? "Saving…" : "Add note"}
							</button>
						</div>
					</form>
				</Modal>
			) : null}
		</section>
	);
};

export default Performance;
