import React, { useCallback, useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { getHttpErrorMessage } from "../../utils/http";
import toast from "react-hot-toast";

const TYPE_STYLES = {
	info: "border-semantic-info/25 bg-semantic-info/10 text-semantic-info",
	warning: "border-semantic-warning/25 bg-semantic-warning/10 text-semantic-warning",
	promotion: "border-secondary-golden-honey/25 bg-secondary-golden-honey/10 text-secondary-golden-honey",
};

const EMPTY_FORM = { title: "", body: "", type: "info", active: true };

const Announcements = () => {
	const { axios } = useAppContext();
	const [announcements, setAnnouncements] = useState([]);
	const [form, setForm] = useState(EMPTY_FORM);
	const [editingId, setEditingId] = useState(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");

	const load = useCallback(async () => {
		setLoading(true);
		setError("");
		try {
			const { data } = await axios.get("/api/announcements", {
				suppressGlobalErrorToast: true,
			});
			if (data.success) {
				setAnnouncements(Array.isArray(data.announcements) ? data.announcements : []);
			} else {
				setError(data.message || "Failed to load announcements");
			}
		} catch (err) {
			setError(getHttpErrorMessage(err, "Failed to load announcements"));
		} finally {
			setLoading(false);
		}
	}, [axios]);

	useEffect(() => {
		load();
	}, [load]);

	const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (!form.title.trim() || !form.body.trim()) {
			toast.error("Title and body are required");
			return;
		}
		setSaving(true);
		try {
			const payload = {
				title: form.title.trim(),
				body: form.body.trim(),
				type: form.type,
				active: form.active,
			};
			const { data } = editingId
				? await axios.patch(`/api/announcements/${editingId}`, payload, {
						suppressGlobalErrorToast: true,
					})
				: await axios.post("/api/announcements", payload, {
						suppressGlobalErrorToast: true,
					});
			if (!data.success) throw new Error(data.message || "Failed to save announcement");
			toast.success(editingId ? "Announcement updated" : "Announcement posted");
			setForm(EMPTY_FORM);
			setEditingId(null);
			await load();
		} catch (err) {
			const message = getHttpErrorMessage(err, "Failed to save announcement");
			setError(message);
			toast.error(message);
		} finally {
			setSaving(false);
		}
	};

	const handleEdit = (item) => {
		setEditingId(item._id);
		setForm({
			title: item.title || "",
			body: item.body || "",
			type: item.type || "info",
			active: Boolean(item.active),
		});
		window.scrollTo?.({ top: 0, behavior: "smooth" });
	};

	const handleCancelEdit = () => {
		setEditingId(null);
		setForm(EMPTY_FORM);
	};

	const handleToggle = async (item) => {
		try {
			const { data } = await axios.patch(
				`/api/announcements/${item._id}`,
				{ active: !item.active },
				{ suppressGlobalErrorToast: true },
			);
			if (!data.success) throw new Error(data.message || "Failed to update announcement");
			toast.success(item.active ? "Announcement deactivated" : "Announcement activated");
			await load();
		} catch (err) {
			const message = getHttpErrorMessage(err, "Failed to update announcement");
			setError(message);
			toast.error(message);
		}
	};

	const handleDelete = async (item) => {
		if (!window.confirm(`Delete "${item.title}"? This cannot be undone.`)) return;
		try {
			const { data } = await axios.delete(`/api/announcements/${item._id}`, {
				suppressGlobalErrorToast: true,
			});
			if (!data.success) throw new Error(data.message || "Failed to delete announcement");
			toast.success("Announcement deleted");
			if (editingId === item._id) handleCancelEdit();
			await load();
		} catch (err) {
			const message = getHttpErrorMessage(err, "Failed to delete announcement");
			setError(message);
			toast.error(message);
		}
	};

	return (
		<div className="p-4 md:p-6 lg:p-8 text-primary-forest-green">
			<div className="mx-auto max-w-6xl space-y-6">
				<div className="flex flex-col gap-3 rounded-3xl border border-primary-forest-green/10 bg-primary-warm-white/75 p-5 shadow-sm backdrop-blur md:flex-row md:items-end md:justify-between md:p-6">
					<div>
						<p className="text-xs font-medium uppercase tracking-[0.16em] text-primary-forest-green/50">Communication</p>
						<h2 className="mt-1 text-2xl font-semibold tracking-tight">
							Announcements <span className="text-secondary-golden-honey">&bullet; bulletin</span>
						</h2>
						<p className="mt-1 text-sm text-primary-forest-green/65">
							Post updates that appear on the storefront and in the mobile app.
						</p>
					</div>
					<button
						onClick={load}
						className="self-start rounded-full border border-primary-forest-green/15 bg-secondary-soft-beige/70 px-4 py-2 text-sm font-medium transition hover:bg-primary-sage-green/15"
					>
						Refresh
					</button>
				</div>

				{error ? (
					<div className="rounded-2xl border border-semantic-error/20 bg-semantic-error/10 p-4 text-sm text-semantic-error shadow-sm">
						{error}
					</div>
				) : null}

				<div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
					<form
						onSubmit={handleSubmit}
						className="rounded-3xl border border-primary-forest-green/10 bg-primary-warm-white/75 p-4 shadow-sm backdrop-blur md:p-5 lg:col-span-2"
					>
						<h3 className="text-lg font-semibold tracking-tight">
							{editingId ? "Edit announcement" : "New announcement"}
						</h3>
						<p className="mt-1 text-xs text-primary-forest-green/55">
							{editingId ? "Update this bulletin in place." : "Share news, promotions, or warnings with shoppers."}
						</p>

						<div className="mt-5 space-y-4">
							<label className="block">
								<span className="text-xs font-medium uppercase tracking-[0.12em] text-primary-forest-green/60">Title</span>
								<input
									type="text"
									value={form.title}
									onChange={(e) => setField("title", e.target.value)}
									placeholder="e.g. Weekend farmers market"
									className="mt-1.5 w-full rounded-xl border border-primary-forest-green/10 bg-secondary-soft-beige/80 px-4 py-3 text-sm outline-none transition focus:border-secondary-golden-honey/60 focus:ring-4 focus:ring-secondary-golden-honey/10"
								/>
							</label>

							<label className="block">
								<span className="text-xs font-medium uppercase tracking-[0.12em] text-primary-forest-green/60">Body</span>
								<textarea
									rows={5}
									value={form.body}
									onChange={(e) => setField("body", e.target.value)}
									placeholder="What should customers know?"
									className="mt-1.5 w-full resize-y rounded-xl border border-primary-forest-green/10 bg-secondary-soft-beige/80 px-4 py-3 text-sm outline-none transition focus:border-secondary-golden-honey/60 focus:ring-4 focus:ring-secondary-golden-honey/10"
								/>
							</label>

							<label className="block">
								<span className="text-xs font-medium uppercase tracking-[0.12em] text-primary-forest-green/60">Type</span>
								<select
									value={form.type}
									onChange={(e) => setField("type", e.target.value)}
									className="mt-1.5 w-full rounded-xl border border-primary-forest-green/10 bg-secondary-soft-beige/80 px-4 py-3 text-sm capitalize outline-none transition focus:border-secondary-golden-honey/60 focus:ring-4 focus:ring-secondary-golden-honey/10"
								>
									<option value="info">Info</option>
									<option value="warning">Warning</option>
									<option value="promotion">Promotion</option>
								</select>
							</label>

							<label className="flex items-center gap-3 rounded-xl border border-primary-forest-green/10 bg-secondary-soft-beige/60 px-4 py-3 text-sm">
								<input
									type="checkbox"
									checked={form.active}
									onChange={(e) => setField("active", e.target.checked)}
									className="h-4 w-4 accent-[#0a7c6d]"
								/>
								<span className="font-medium">Active (visible to customers)</span>
							</label>

							<div className="flex flex-wrap gap-2 pt-1">
								<button
									type="submit"
									disabled={saving}
									className="rounded-full bg-primary-forest-green px-5 py-2.5 text-sm font-medium text-primary-cream shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
								>
									{saving ? "Saving…" : editingId ? "Save changes" : "Post announcement"}
								</button>
								{editingId ? (
									<button
										type="button"
										onClick={handleCancelEdit}
										className="rounded-full border border-primary-forest-green/15 bg-primary-warm-white/70 px-5 py-2.5 text-sm font-medium transition hover:bg-primary-sage-green/15"
									>
										Cancel
									</button>
								) : null}
							</div>
						</div>
					</form>

					<section className="overflow-hidden rounded-3xl border border-primary-forest-green/10 bg-primary-warm-white/75 shadow-sm backdrop-blur lg:col-span-3">
						<div className="border-b border-primary-forest-green/10 px-4 py-4 md:px-5">
							<h3 className="text-lg font-semibold tracking-tight">Posted announcements</h3>
							<p className="mt-1 text-xs text-primary-forest-green/55">
								{loading ? "Loading…" : `${announcements.length} total`}
							</p>
						</div>

						{loading ? (
							<div className="space-y-2 p-4 md:p-5">
								<div className="h-20 animate-pulse rounded-2xl bg-primary-sage-green/10" />
								<div className="h-20 animate-pulse rounded-2xl bg-primary-sage-green/10" />
								<div className="h-20 animate-pulse rounded-2xl bg-primary-sage-green/10" />
							</div>
						) : announcements.length === 0 ? (
							<div className="p-8 text-center text-sm text-primary-forest-green/60">
								No announcements yet. Post the first one using the form.
							</div>
						) : (
							<ul className="divide-y divide-primary-forest-green/8">
								{announcements.map((item) => (
									<li key={item._id} className={`p-4 md:p-5 ${editingId === item._id ? "bg-secondary-golden-honey/5" : ""}`}>
										<div className="flex flex-wrap items-start justify-between gap-3">
											<div className="min-w-0">
												<div className="flex flex-wrap items-center gap-2">
													<p className="font-semibold">{item.title}</p>
													<span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-medium capitalize ${TYPE_STYLES[item.type] || TYPE_STYLES.info}`}>
														{item.type || "info"}
													</span>
													<span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${item.active ? "border-semantic-success/25 bg-semantic-success/10 text-semantic-success" : "border-primary-forest-green/15 bg-secondary-soft-beige/70 text-primary-forest-green/60"}`}>
														{item.active ? "active" : "inactive"}
													</span>
												</div>
												<p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-primary-forest-green/75">
													{item.body}
												</p>
												<p className="mt-2 text-xs text-primary-forest-green/50">
													{item.createdAt ? new Date(item.createdAt).toLocaleString() : "—"}
												</p>
											</div>
											<div className="flex shrink-0 flex-wrap gap-2">
												<button
													onClick={() => handleEdit(item)}
													className="rounded-full border border-primary-forest-green/15 bg-primary-warm-white/70 px-3 py-1.5 text-xs font-medium transition hover:bg-primary-sage-green/15"
												>
													Edit
												</button>
												<button
													onClick={() => handleToggle(item)}
													className="rounded-full border border-primary-forest-green/15 bg-primary-warm-white/70 px-3 py-1.5 text-xs font-medium transition hover:bg-primary-sage-green/15"
												>
													{item.active ? "Deactivate" : "Activate"}
												</button>
												<button
													onClick={() => handleDelete(item)}
													className="rounded-full border border-semantic-error/25 bg-semantic-error/5 px-3 py-1.5 text-xs font-medium text-semantic-error transition hover:bg-semantic-error/10"
												>
													Delete
												</button>
											</div>
										</div>
									</li>
								))}
							</ul>
						)}
					</section>
				</div>
			</div>
		</div>
	);
};

export default Announcements;
