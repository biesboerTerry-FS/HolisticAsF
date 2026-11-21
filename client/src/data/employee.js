export const EMPLOYEE_STORAGE_KEY = "holisticaf-demo-employee";

export const DEMO_EMPLOYEE = {
	employeeId: "demo-employee-1",
	name: "Jordan Rivera",
	email: "jordan@holisticaf.com",
	phone: "(555) 010-2044",
	address: "100 Holistic Way, Portland, OR 97203",
	position: "Store Associate",
};

const pad = (n) => String(n).padStart(2, "0");

const dateFromNow = (days) => {
	const date = new Date();
	date.setDate(date.getDate() + days);
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

// Bundled fallback so the portal still works if the API is unavailable.
export const demoShifts = () => [
	{ _id: "demo-shift-1", date: dateFromNow(1), startTime: "09:00", endTime: "17:00", role: "Floor support", location: "HolisticAF Store", status: "scheduled" },
	{ _id: "demo-shift-2", date: dateFromNow(3), startTime: "10:00", endTime: "18:00", role: "Inventory restock", location: "HolisticAF Store", status: "scheduled" },
	{ _id: "demo-shift-3", date: dateFromNow(6), startTime: "08:00", endTime: "15:00", role: "Morning prep", location: "HolisticAF Store", status: "scheduled" },
];
