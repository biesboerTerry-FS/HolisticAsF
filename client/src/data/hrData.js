// Local-first fallback for the admin HR suite. The backend is the source of
// truth when available; these helpers keep the demo usable offline.

const EMPLOYEES_KEY = "holisticaf-hr-employees";
const PAY_RUNS_KEY = "holisticaf-hr-pay-runs";
const NOTES_KEY = "holisticaf-hr-performance-notes";
const SETTINGS_KEY = "holisticaf-hr-settings";

const pad = (n) => String(n).padStart(2, "0");
export const toYMD = (date) =>
	`${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
export const daysFromNow = (days) => {
	const date = new Date();
	date.setDate(date.getDate() + days);
	return toYMD(date);
};
const monthLabel = (offset = 0) => {
	const date = new Date();
	date.setDate(1);
	date.setMonth(date.getMonth() + offset);
	return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
};
const monthRange = (offset = 0) => {
	const date = new Date();
	date.setDate(1);
	date.setMonth(date.getMonth() + offset);
	return {
		startDate: toYMD(date),
		endDate: toYMD(new Date(date.getFullYear(), date.getMonth() + 1, 0)),
	};
};

const read = (key, fallback) => {
	try {
		const raw = localStorage.getItem(key);
		if (!raw) return fallback;
		const parsed = JSON.parse(raw);
		return Array.isArray(fallback)
			? Array.isArray(parsed) ? parsed : fallback
			: parsed || fallback;
	} catch {
		return fallback;
	}
};

const write = (key, value) => {
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch {
		// Storage may be unavailable — in-memory state still works this session.
	}
};

const withSeeded = (key, seed, idField) => {
	const stored = read(key, null);
	if (!Array.isArray(stored)) {
		write(key, seed);
		return seed;
	}
	const known = new Set(stored.map((item) => item[idField]));
	const merged = [...stored, ...seed.filter((item) => !known.has(item[idField]))];
	if (merged.length !== stored.length) write(key, merged);
	return merged;
};

export const HR_SEED_EMPLOYEES = [
	{
		employeeId: "demo-employee-1",
		name: "Jordan Rivera",
		email: "jordan@holisticaf.com",
		phone: "(503) 555-0144",
		address: "100 Holistic Way, Portland, OR 97203",
		position: "Store Associate",
		department: "Sales floor",
		rate: 22.5,
		payType: "hourly",
		color: "#1e4d43",
		active: true,
		notes: "Reliable opening shift; trained on the new produce checklist.",
	},
	{
		employeeId: "emp-maya-chen",
		name: "Maya Chen",
		email: "maya@holisticaf.com",
		phone: "(503) 555-0142",
		address: "412 SW Alder St, Portland, OR 97205",
		position: "Store Manager",
		department: "Management",
		rate: 68000,
		payType: "salary",
		color: "#c27d1b",
		active: true,
	},
	{
		employeeId: "emp-marcus-thompson",
		name: "Marcus Thompson",
		email: "marcus.t@holisticaf.com",
		phone: "(503) 555-0178",
		address: "88 SE Belmont St, Portland, OR 97214",
		position: "Inventory Lead",
		department: "Warehouse",
		rate: 26,
		payType: "hourly",
		color: "#3f6f8f",
		active: true,
	},
	{
		employeeId: "emp-priya-nair",
		name: "Priya Nair",
		email: "priya@holisticaf.com",
		phone: "(503) 555-0193",
		address: "1221 NW 13th Ave, Portland, OR 97209",
		position: "Produce Specialist",
		department: "Produce",
		rate: 24.25,
		payType: "hourly",
		color: "#6b8f3a",
		active: true,
	},
	{
		employeeId: "emp-diego-alvarez",
		name: "Diego Alvarez",
		email: "diego@holisticaf.com",
		phone: "(503) 555-0126",
		address: "3400 SE Division St, Portland, OR 97202",
		position: "Delivery Driver",
		department: "Logistics",
		rate: 21.75,
		payType: "hourly",
		color: "#9a5b3d",
		active: true,
	},
	{
		employeeId: "emp-aisha-brooks",
		name: "Aisha Brooks",
		email: "aisha@holisticaf.com",
		phone: "(503) 555-0155",
		address: "609 SW 5th Ave, Portland, OR 97204",
		position: "Cashier",
		department: "Sales floor",
		rate: 19.5,
		payType: "hourly",
		color: "#8b5f8f",
		active: true,
	},
	{
		employeeId: "emp-sofia-patel",
		name: "Sofia Patel",
		email: "sofia@holisticaf.com",
		phone: "(503) 555-0184",
		address: "1500 SW Morrison St, Portland, OR 97205",
		position: "Bookkeeper",
		department: "Administration",
		rate: 30,
		payType: "hourly",
		color: "#4b6b8a",
		active: true,
	},
	{
		employeeId: "emp-noah-bennett",
		name: "Noah Bennett",
		email: "noah@holisticaf.com",
		phone: "(503) 555-0111",
		address: "720 NE Broadway, Portland, OR 97232",
		position: "Merchandiser",
		department: "Marketing",
		rate: 23,
		payType: "hourly",
		color: "#777777",
		active: false,
	},
];

const prev = monthRange(-1);
const curr = monthRange(0);

const HR_SEED_PAY_RUNS = [
	{ id: "pay-jordan-prev", employeeId: "demo-employee-1", employeeName: "Jordan Rivera", period: monthLabel(-1), ...prev, amount: 1840, status: "paid", note: "Regular hourly pay — 80 hours." },
	{ id: "pay-jordan-cur", employeeId: "demo-employee-1", employeeName: "Jordan Rivera", period: monthLabel(0), ...curr, amount: 936, status: "pending", note: "Regular hourly pay — first half of period." },
	{ id: "pay-maya-cur", employeeId: "emp-maya-chen", employeeName: "Maya Chen", period: monthLabel(0), ...curr, amount: 5666.67, status: "paid", note: "Monthly salary disbursement." },
	{ id: "pay-marcus-cur", employeeId: "emp-marcus-thompson", employeeName: "Marcus Thompson", period: monthLabel(0), ...curr, amount: 2184, status: "paid", note: "Includes 4 hours of overtime." },
	{ id: "pay-priya-cur", employeeId: "emp-priya-nair", employeeName: "Priya Nair", period: monthLabel(0), ...curr, amount: 2037, status: "pending", note: "Regular hourly pay." },
	{ id: "pay-diego-cur", employeeId: "emp-diego-alvarez", employeeName: "Diego Alvarez", period: monthLabel(0), ...curr, amount: 1780, status: "paid", note: "Regular hourly pay plus route bonus." },
	{ id: "pay-aisha-cur", employeeId: "emp-aisha-brooks", employeeName: "Aisha Brooks", period: monthLabel(0), ...curr, amount: 1560, status: "pending", note: "Regular hourly pay." },
];

const HR_SEED_NOTES = [
	{ id: "perf-jordan-1", employeeId: "demo-employee-1", employeeName: "Jordan Rivera", author: "Maya Chen", date: daysFromNow(-21), text: "Jordan has been a steady presence on opening shifts. Picked up the new produce checklist quickly and has been helping newer associates with stocking routines." },
	{ id: "perf-jordan-2", employeeId: "demo-employee-1", employeeName: "Jordan Rivera", author: "Maya Chen", date: daysFromNow(-60), text: "Reliable attendance and a friendly attitude with customers. Would like to see Jordan cross-trained in the warehouse next quarter." },
	{ id: "perf-marcus-1", employeeId: "emp-marcus-thompson", employeeName: "Marcus Thompson", author: "Maya Chen", date: daysFromNow(-14), text: "Inventory variance is down to under 1% thanks to Marcus's revised counting process. Great ownership of the weekly cycle counts." },
	{ id: "perf-priya-1", employeeId: "emp-priya-nair", employeeName: "Priya Nair", author: "Maya Chen", date: daysFromNow(-9), text: "Priya sourced two new local farms this month and the produce quality has been excellent. Customers have mentioned the displays by name." },
	{ id: "perf-aisha-1", employeeId: "emp-aisha-brooks", employeeName: "Aisha Brooks", author: "Maya Chen", date: daysFromNow(-5), text: "Aisha handled a busy holiday weekend at the register without a single complaint. Strong candidate for shift supervisor training." },
	{ id: "perf-diego-1", employeeId: "emp-diego-alvarez", employeeName: "Diego Alvarez", author: "Sofia Patel", date: daysFromNow(-30), text: "All morning deliveries arrived on time this month. Diego flagged a recurring loading-dock issue before it became a safety problem." },
];

export const HR_SEED_SETTINGS = {
	departments: ["Management", "Sales floor", "Produce", "Warehouse", "Logistics", "Marketing", "Administration"],
	roles: ["Store Manager", "Shift Supervisor", "Store Associate", "Cashier", "Produce Specialist", "Inventory Lead", "Delivery Driver", "Merchandiser", "Bookkeeper"],
};

// ---- Employees ------------------------------------------------------------

export const getHrEmployees = () => withSeeded(EMPLOYEES_KEY, HR_SEED_EMPLOYEES, "employeeId");
export const saveHrEmployees = (employees) => write(EMPLOYEES_KEY, employees);

export const upsertHrEmployeeLocal = (employee) => {
	const employees = getHrEmployees();
	const index = employees.findIndex((item) => item.employeeId === employee.employeeId);
	const next = index >= 0
		? employees.map((item) => (item.employeeId === employee.employeeId ? { ...item, ...employee } : item))
		: [{ ...employee }, ...employees];
	saveHrEmployees(next);
	return next;
};

export const setHrEmployeeStatusLocal = (employeeId, active) =>
	upsertHrEmployeeLocal({ employeeId, active });

// ---- Payroll --------------------------------------------------------------

export const getPayRuns = (employeeId) => {
	const runs = withSeeded(PAY_RUNS_KEY, HR_SEED_PAY_RUNS, "id");
	return employeeId ? runs.filter((run) => run.employeeId === employeeId) : runs;
};

export const addPayRunLocal = (run) => {
	const runs = getPayRuns();
	const next = [{ id: `pay-${Date.now()}`, ...run }, ...runs];
	write(PAY_RUNS_KEY, next);
	return next;
};

// ---- Performance notes ----------------------------------------------------

export const getPerformanceNotes = (employeeId) => {
	const notes = withSeeded(NOTES_KEY, HR_SEED_NOTES, "id");
	return employeeId ? notes.filter((note) => note.employeeId === employeeId) : notes;
};

export const addPerformanceNoteLocal = (note) => {
	const notes = getPerformanceNotes();
	const next = [{ id: `perf-${Date.now()}`, ...note }, ...notes];
	write(NOTES_KEY, next);
	return next;
};

// ---- Settings -------------------------------------------------------------

export const getHrSettings = () => read(SETTINGS_KEY, HR_SEED_SETTINGS) || HR_SEED_SETTINGS;
export const saveHrSettings = (settings) => write(SETTINGS_KEY, settings);
