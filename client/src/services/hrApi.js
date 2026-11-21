// Thin API layer for the admin HR suite. Every call targets authAdmin-protected
// /api/hr routes; when the backend is unreachable the demo falls back to the
// shared localStorage helpers so the portal stays usable.
import {
	addPayRunLocal,
	addPerformanceNoteLocal,
	getHrEmployees,
	getHrSettings,
	getPayRuns,
	getPerformanceNotes,
	saveHrSettings,
	setHrEmployeeStatusLocal,
	upsertHrEmployeeLocal,
} from "../data/hrData";
import {
	getTimeOffRequests,
	replaceTimeOffRequests,
	setTimeOffRequestStatus,
} from "../data/portalData";

const call = async (axios, method, url, data) => {
	const response = await axios({
		method,
		url,
		data,
		suppressGlobalErrorToast: true,
	});
	if (response.data?.success === false) {
		const error = new Error(response.data?.message || "HR request failed.");
		error.httpStatus = response.status;
		throw error;
	}
	return response.data;
};

// Only a network failure (server unreachable) uses local demo storage. A real
// server response — including validation errors — is surfaced to the UI.
const fallback = async (local, remote) => {
	try {
		return await remote();
	} catch (error) {
		if (error?.response || error?.httpStatus) throw error;
		const result = local();
		return { ...result, offline: true, error };
	}
};

const normalizeEmployee = (employee) => ({ ...employee, employeeId: employee.employeeId || employee.id });
const normalizeRun = (run) => ({ ...run, id: run.id || run._id });
const normalizeNote = (note) => ({ ...note, id: note.id || note._id });

// ---- Employees ------------------------------------------------------------

export const loadEmployees = async (axios) =>
	fallback(() => ({ items: getHrEmployees() }), async () => {
		const data = await call(axios, "get", "/api/hr/employees");
		const items = (data.employees || []).map(normalizeEmployee);
		// Keep the local copy in sync for offline demo sessions.
		localStorage.setItem("holisticaf-hr-employees", JSON.stringify(items));
		return { items };
	});

export const saveEmployee = async (axios, employee, isEdit) =>
	fallback(
		() => {
			const items = upsertHrEmployeeLocal(employee);
			return { item: employee, items, message: "Employee saved locally." };
		},
		async () => {
			const { name, employeeId, email, phone, address, position, department, rate, payType, color, notes, active } = employee;
			const payload = { name, employeeId, email, phone, address, position, department, rate, payType, color, notes, active };
			const data = await call(
				axios,
				isEdit ? "put" : "post",
				isEdit ? `/api/hr/employees/${encodeURIComponent(employee._id || employeeId)}` : "/api/hr/employees",
				payload,
			);
			const item = normalizeEmployee(data.employee);
			upsertHrEmployeeLocal(item);
			return { item, message: data.message };
		},
	);

export const setEmployeeStatus = async (axios, employee, active) =>
	fallback(
		() => ({ item: { ...employee, active }, items: setHrEmployeeStatusLocal(employee.employeeId, active) }),
		async () => {
			const data = await call(
				axios,
				"patch",
				`/api/hr/employees/${encodeURIComponent(employee._id || employee.employeeId)}/status`,
				{ active },
			);
			const item = normalizeEmployee(data.employee);
			upsertHrEmployeeLocal(item);
			return { item, message: data.message };
		},
	);

// ---- Payroll --------------------------------------------------------------

export const loadPayRuns = async (axios, employeeId) =>
	fallback(() => ({ items: getPayRuns(employeeId) }), async () => {
		const data = await call(axios, "get", "/api/hr/pay-runs", undefined);
		let items = (data.payRuns || []).map(normalizeRun);
		if (employeeId) items = items.filter((run) => run.employeeId === employeeId);
		return { items };
	});

export const runPayroll = async (axios, run) =>
	fallback(
		() => ({ item: { id: `pay-${Date.now()}`, ...run }, items: addPayRunLocal(run) }),
		async () => {
			const data = await call(axios, "post", "/api/hr/pay-runs", run);
			const item = normalizeRun(data.payRun);
			addPayRunLocal(item);
			return { item, message: data.message };
		},
	);

// ---- Performance notes ----------------------------------------------------

export const loadNotes = async (axios, employeeId) =>
	fallback(() => ({ items: getPerformanceNotes(employeeId) }), async () => {
		const data = await call(axios, "get", "/api/hr/performance-notes");
		let items = (data.notes || []).map(normalizeNote);
		if (employeeId) items = items.filter((note) => note.employeeId === employeeId);
		return { items };
	});

export const addNote = async (axios, note) =>
	fallback(
		() => ({ item: { id: `perf-${Date.now()}`, ...note }, items: addPerformanceNoteLocal(note) }),
		async () => {
			const data = await call(axios, "post", "/api/hr/performance-notes", note);
			const item = normalizeNote(data.note);
			addPerformanceNoteLocal(item);
			return { item, message: data.message };
		},
	);

// ---- Settings -------------------------------------------------------------

export const loadSettings = async (axios) =>
	fallback(() => ({ settings: getHrSettings() }), async () => {
		const data = await call(axios, "get", "/api/hr/settings");
		const settings = data.settings || { departments: [], roles: [] };
		saveHrSettings(settings);
		return { settings };
	});

export const saveSettings = async (axios, settings) =>
	fallback(
		() => {
			saveHrSettings(settings);
			return { settings };
		},
		async () => {
			const data = await call(axios, "put", "/api/hr/settings", settings);
			const next = data.settings || settings;
			saveHrSettings(next);
			return { settings: next, message: data.message };
		},
	);

// ---- Time off -------------------------------------------------------------

const normalizeTimeOff = (request) => ({
	...request,
	id: request.id || request.requestId,
});

export const loadTimeOff = async (axios) => {
	const local = getTimeOffRequests();
	try {
		const data = await call(axios, "get", "/api/hr/timeoff");
		const remote = (data.requests || []).map(normalizeTimeOff);
		// A decision made offline should win over a stale server "pending" value.
		const merged = remote.map((request) => {
			const localCopy = local.find((item) => item.id === request.id);
			if (localCopy && ["approved", "denied"].includes(localCopy.status) && request.status === "pending") {
				return { ...request, ...localCopy };
			}
			return request;
		});
		for (const item of local) {
			if (!merged.some((request) => request.id === item.id)) merged.push(item);
		}
		replaceTimeOffRequests(merged);
		return { items: merged };
	} catch {
		return { items: local, offline: true };
	}
};

export const decideTimeOff = async (axios, request, status) => {
	// Update the portal store first so the employee sees the decision instantly.
	const items = setTimeOffRequestStatus(request.id, status);
	try {
		const data = await call(axios, "patch", `/api/hr/timeoff/${encodeURIComponent(request.id)}`, { status });
		return { item: normalizeTimeOff(data.request) || request, items, message: data.message };
	} catch {
		return { item: { ...request, status }, items, offline: true };
	}
};
