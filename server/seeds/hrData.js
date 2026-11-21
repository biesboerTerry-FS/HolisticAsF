// Realistic HR demo data shared by the lazy seeder and the standalone seed
// script. Employees use stable employeeIds so repeat seeds never duplicate.

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
	const start = new Date(date);
	const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
	return { startDate: toYMD(start), endDate: toYMD(end) };
};

export const HR_DEPARTMENTS = [
	"Management",
	"Sales floor",
	"Produce",
	"Warehouse",
	"Logistics",
	"Marketing",
	"Administration",
];

export const HR_ROLES = [
	"Store Manager",
	"Shift Supervisor",
	"Store Associate",
	"Cashier",
	"Produce Specialist",
	"Inventory Lead",
	"Delivery Driver",
	"Merchandiser",
	"Bookkeeper",
];

export const HR_EMPLOYEES = [
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
		notes: "Runs the Portland store and weekly team scheduling.",
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
		notes: "Certified forklift operator; owns weekly stock counts.",
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
		notes: "Handles local vendor relationships and quality checks.",
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
		notes: "Morning delivery route; clean driving record.",
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
		notes: "Top-rated customer service scores three months running.",
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
		notes: "Prepares the monthly payroll file and vendor invoices.",
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
		notes: "On inactive status since the spring campaign ended.",
	},
];

export const buildPayRuns = () => {
	const previous = monthRange(-1);
	const current = monthRange(0);
	return [
		{
			key: "pay-demo-employee-1-prev",
			employeeId: "demo-employee-1",
			employeeName: "Jordan Rivera",
			period: monthLabel(-1),
			...previous,
			amount: 1840,
			status: "paid",
			note: "Regular hourly pay — 80 hours.",
		},
		{
			key: "pay-demo-employee-1-cur",
			employeeId: "demo-employee-1",
			employeeName: "Jordan Rivera",
			period: monthLabel(0),
			...current,
			amount: 936,
			status: "pending",
			note: "Regular hourly pay — first half of period.",
		},
		{
			key: "pay-emp-maya-chen-cur",
			employeeId: "emp-maya-chen",
			employeeName: "Maya Chen",
			period: monthLabel(0),
			...current,
			amount: 5666.67,
			status: "paid",
			note: "Monthly salary disbursement.",
		},
		{
			key: "pay-emp-marcus-thompson-cur",
			employeeId: "emp-marcus-thompson",
			employeeName: "Marcus Thompson",
			period: monthLabel(0),
			...current,
			amount: 2184,
			status: "paid",
			note: "Includes 4 hours of overtime.",
		},
		{
			key: "pay-emp-priya-nair-cur",
			employeeId: "emp-priya-nair",
			employeeName: "Priya Nair",
			period: monthLabel(0),
			...current,
			amount: 2037,
			status: "pending",
			note: "Regular hourly pay.",
		},
		{
			key: "pay-emp-diego-alvarez-cur",
			employeeId: "emp-diego-alvarez",
			employeeName: "Diego Alvarez",
			period: monthLabel(0),
			...current,
			amount: 1780,
			status: "paid",
			note: "Regular hourly pay plus route bonus.",
		},
		{
			key: "pay-emp-aisha-brooks-cur",
			employeeId: "emp-aisha-brooks",
			employeeName: "Aisha Brooks",
			period: monthLabel(0),
			...current,
			amount: 1560,
			status: "pending",
			note: "Regular hourly pay.",
		},
	];
};

export const buildPerformanceNotes = () => [
	{
		key: "perf-jordan-1",
		employeeId: "demo-employee-1",
		employeeName: "Jordan Rivera",
		author: "Maya Chen",
		date: daysFromNow(-21),
		text: "Jordan has been a steady presence on opening shifts. Picked up the new produce checklist quickly and has been helping newer associates with stocking routines.",
	},
	{
		key: "perf-jordan-2",
		employeeId: "demo-employee-1",
		employeeName: "Jordan Rivera",
		author: "Maya Chen",
		date: daysFromNow(-60),
		text: "Reliable attendance and a friendly attitude with customers. Would like to see Jordan cross-trained in the warehouse next quarter.",
	},
	{
		key: "perf-marcus-1",
		employeeId: "emp-marcus-thompson",
		employeeName: "Marcus Thompson",
		author: "Maya Chen",
		date: daysFromNow(-14),
		text: "Inventory variance is down to under 1% thanks to Marcus's revised counting process. Great ownership of the weekly cycle counts.",
	},
	{
		key: "perf-priya-1",
		employeeId: "emp-priya-nair",
		employeeName: "Priya Nair",
		author: "Maya Chen",
		date: daysFromNow(-9),
		text: "Priya sourced two new local farms this month and the produce quality has been excellent. Customers have mentioned the displays by name.",
	},
	{
		key: "perf-aisha-1",
		employeeId: "emp-aisha-brooks",
		employeeName: "Aisha Brooks",
		author: "Maya Chen",
		date: daysFromNow(-5),
		text: "Aisha handled a busy holiday weekend at the register without a single complaint. Strong candidate for shift supervisor training.",
	},
	{
		key: "perf-diego-1",
		employeeId: "emp-diego-alvarez",
		employeeName: "Diego Alvarez",
		author: "Sofia Patel",
		date: daysFromNow(-30),
		text: "All morning deliveries arrived on time this month. Diego flagged a recurring loading-dock issue before it became a safety problem.",
	},
];

export const buildTimeOffRequests = () => [
	{
		requestId: "timeoff-1",
		employeeId: "demo-employee-1",
		employeeName: "Jordan Rivera",
		startDate: daysFromNow(10),
		endDate: daysFromNow(12),
		reason: "Family event out of town",
		status: "pending",
	},
	{
		requestId: "timeoff-2",
		employeeId: "emp-marcus-thompson",
		employeeName: "Marcus Thompson",
		startDate: daysFromNow(5),
		endDate: daysFromNow(6),
		reason: "Scheduled medical appointment",
		status: "pending",
	},
	{
		requestId: "timeoff-3",
		employeeId: "emp-priya-nair",
		employeeName: "Priya Nair",
		startDate: daysFromNow(14),
		endDate: daysFromNow(17),
		reason: "Vendor conference in Seattle",
		status: "pending",
	},
	{
		requestId: "timeoff-4",
		employeeId: "emp-aisha-brooks",
		employeeName: "Aisha Brooks",
		startDate: daysFromNow(2),
		endDate: daysFromNow(2),
		reason: "Personal day",
		status: "approved",
	},
	{
		requestId: "timeoff-5",
		employeeId: "emp-diego-alvarez",
		employeeName: "Diego Alvarez",
		startDate: daysFromNow(8),
		endDate: daysFromNow(9),
		reason: "Moving help for a family member",
		status: "pending",
	},
];
