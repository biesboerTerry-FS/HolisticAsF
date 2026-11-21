import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../../../context/AppContext";
import { getHttpErrorMessage } from "../../../utils/http";
import { loadSettings, saveSettings } from "../../../services/hrApi";
import { HrHeader, OfflineBanner } from "./HrUi";
import { inputClass, primaryButton, secondaryButton } from "./hrStyles";

const Settings = () => {
	const { axios } = useAppContext();
	const [departments, setDepartments] = useState([]);
	const [roles, setRoles] = useState([]);
	const [departmentInput, setDepartmentInput] = useState("");
	const [roleInput, setRoleInput] = useState("");
	const [loading, setLoading] = useState(true);
	const [offline, setOffline] = useState(false);
	const [error, setError] = useState("");
	const [saving, setSaving] = useState(false);
	const [dirty, setDirty] = useState(false);

	useEffect(() => {
		let current = true;
		const load = async () => {
			setLoading(true);
			setError("");
			try {
				const result = await loadSettings(axios);
				if (!current) return;
				setDepartments(result.settings.departments || []);
				setRoles(result.settings.roles || []);
				setOffline(Boolean(result.offline));
			} catch (err) {
				if (current) setError(getHttpErrorMessage(err, "Failed to load HR settings"));
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

	const addItem = (value, setter, inputSetter, list, label) => {
		const trimmed = value.trim();
		if (!trimmed) return;
		if (list.some((item) => item.toLowerCase() === trimmed.toLowerCase())) {
			toast.error(`${label} already exists`);
			return;
		}
		setter([...list, trimmed]);
		inputSetter("");
		setDirty(true);
	};

	const removeItem = (value, setter, list) => {
		setter(list.filter((item) => item !== value));
		setDirty(true);
	};

	const handleSave = async () => {
		setSaving(true);
		try {
			const result = await saveSettings(axios, { departments, roles });
			setDepartments(result.settings.departments || departments);
			setRoles(result.settings.roles || roles);
			setDirty(false);
			if (result.offline) setOffline(true);
			toast.success("HR settings saved");
		} catch (err) {
			toast.error(getHttpErrorMessage(err, "Failed to save HR settings"));
		} finally {
			setSaving(false);
		}
	};

	const ListEditor = ({ title, items, value, onValueChange, onAdd, onRemove, testId }) => (
		<div className="rounded-2xl border border-primary-forest-green/10 bg-secondary-soft-beige/40 p-4">
			<h3 className="text-base font-semibold tracking-tight">{title}</h3>
			<p className="mt-0.5 text-xs text-primary-forest-green/55">
				Used as the pick-list when adding or editing employees.
			</p>
			<div className="mt-4 flex gap-2">
				<input
					data-testid={testId}
					aria-label={`New ${title.toLowerCase().replace(/s$/, "")}`}
					className={inputClass}
					value={value}
					placeholder={`Add ${title.toLowerCase().replace(/s$/, "")}…`}
					onChange={(event) => onValueChange(event.target.value)}
					onKeyDown={(event) => {
						if (event.key === "Enter") {
							event.preventDefault();
							onAdd();
						}
					}}
				/>
				<button data-testid={`hr-add-${testId}`} type="button" onClick={onAdd} className={secondaryButton}>
					Add
				</button>
			</div>
			<ul data-testid={`hr-list-${testId}`} className="mt-4 flex flex-wrap gap-2">
				{loading ? (
					<li className="text-sm text-primary-forest-green/60">Loading…</li>
				) : items.length === 0 ? (
					<li className="text-sm text-primary-forest-green/60">Nothing here yet.</li>
				) : (
					items.map((item) => (
						<li key={item} className="flex items-center gap-2 rounded-full border border-primary-forest-green/15 bg-primary-warm-white/80 py-1 pl-3 pr-1.5 text-sm">
							{item}
							<button
								type="button"
								onClick={() => onRemove(item)}
								aria-label={`Remove ${item}`}
								className="rounded-full px-1.5 text-primary-forest-green/50 transition hover:bg-semantic-error/10 hover:text-semantic-error"
							>
								✕
							</button>
						</li>
					))
				)}
			</ul>
		</div>
	);

	return (
		<section className="space-y-5">
			<HrHeader
				eyebrow="Configuration"
				title="HR"
				accent="settings"
				description="Maintain the department and job-role labels available across the HR suite."
				actions={
					<button data-testid="hr-save-settings" onClick={handleSave} disabled={saving || !dirty} className={primaryButton}>
						{saving ? "Saving…" : "Save changes"}
					</button>
				}
			/>
			<OfflineBanner offline={offline} />
			{error ? (
				<div className="rounded-2xl border border-semantic-error/20 bg-semantic-error/10 p-4 text-sm text-semantic-error">
					{error}
				</div>
			) : null}
			{dirty ? (
				<p className="rounded-2xl border border-secondary-golden-honey/30 bg-secondary-golden-honey/10 px-4 py-2 text-xs text-secondary-earthy-brown">
					You have unsaved changes.
				</p>
			) : null}

			<div className="grid gap-4 lg:grid-cols-2">
				<ListEditor
					title="Departments"
					items={departments}
					value={departmentInput}
					onValueChange={setDepartmentInput}
					onAdd={() => addItem(departmentInput, setDepartments, setDepartmentInput, departments, "Department")}
					onRemove={(item) => removeItem(item, setDepartments, departments)}
					testId="hr-department-input"
				/>
				<ListEditor
					title="Roles"
					items={roles}
					value={roleInput}
					onValueChange={setRoleInput}
					onAdd={() => addItem(roleInput, setRoles, setRoleInput, roles, "Role")}
					onRemove={(item) => removeItem(item, setRoles, roles)}
					testId="hr-role-input"
				/>
			</div>
		</section>
	);
};

export default Settings;
