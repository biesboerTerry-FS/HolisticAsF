// Local-first persistence for the demo portals. Every helper degrades
// gracefully when localStorage is unavailable (private mode, SSR, etc.).

export const MESSAGES_KEY = "holisticaf-messages";
const REQUESTS_KEY = "holisticaf-schedule-requests";
const TIMEOFF_KEY = "holisticaf-timeoff-requests";
const AVAILABILITY_KEY = "holisticaf-availability";
const ORDER_OVERRIDES_KEY = "holisticaf-order-status";
const DEMO_ORDERS_KEY = "holisticaf-demo-orders";

const daysFromNow = (days) => {
	const date = new Date();
	date.setDate(date.getDate() + days);
	return date.toISOString();
};

const DEMO_MESSAGES = [
	{
		id: "msg-1",
		toRole: "admin",
		fromRole: "employee",
		sender: "Jordan Rivera",
		subject: "Cover for Saturday shift",
		body: "Hi! I can cover the Saturday morning shift if anyone needs a swap. Let me know and I'll update my availability.",
		date: daysFromNow(-1),
		read: false,
	},
	{
		id: "msg-2",
		toRole: "admin",
		fromRole: "customer",
		sender: "A. Customer",
		subject: "Question about my order",
		body: "I placed an order yesterday and was wondering when it will be ready for pickup. Thanks!",
		date: daysFromNow(-2),
		read: false,
	},
	{
		id: "msg-3",
		toRole: "employee",
		fromRole: "admin",
		sender: "Store Manager",
		subject: "New checklist for produce",
		body: "Please review the updated produce checklist before your next shift. It is pinned in the break room.",
		date: daysFromNow(-1),
		read: false,
	},
	{
		id: "msg-4",
		toRole: "employee",
		fromRole: "admin",
		sender: "Store Manager",
		subject: "Team meeting Friday",
		body: "Quick team meeting this Friday at 8:45am before the floor opens. See you there!",
		date: daysFromNow(-3),
		read: true,
	},
];

const DEMO_REQUESTS = [
	{
		id: "req-1",
		employeeId: "demo-employee-1",
		employeeName: "Jordan Rivera",
		type: "shift",
		date: daysFromNow(4),
		detail: "Prefer morning shift (9:00–17:00)",
		status: "pending",
		createdAt: daysFromNow(-1),
	},
	{
		id: "req-2",
		employeeId: "emp-marcus-thompson",
		employeeName: "Marcus Thompson",
		type: "shift",
		date: daysFromNow(6),
		detail: "Swap Thursday evening for Friday morning",
		status: "pending",
		createdAt: daysFromNow(-2),
	},
];

const DEMO_TIMEOFF = [
	{
		id: "timeoff-1",
		employeeId: "demo-employee-1",
		employeeName: "Jordan Rivera",
		startDate: daysFromNow(10),
		endDate: daysFromNow(12),
		reason: "Family event out of town",
		status: "pending",
		createdAt: daysFromNow(-2),
	},
	{
		id: "timeoff-2",
		employeeId: "emp-marcus-thompson",
		employeeName: "Marcus Thompson",
		startDate: daysFromNow(5),
		endDate: daysFromNow(6),
		reason: "Scheduled medical appointment",
		status: "pending",
		createdAt: daysFromNow(-3),
	},
	{
		id: "timeoff-3",
		employeeId: "emp-priya-nair",
		employeeName: "Priya Nair",
		startDate: daysFromNow(14),
		endDate: daysFromNow(17),
		reason: "Vendor conference in Seattle",
		status: "pending",
		createdAt: daysFromNow(-4),
	},
	{
		id: "timeoff-4",
		employeeId: "emp-aisha-brooks",
		employeeName: "Aisha Brooks",
		startDate: daysFromNow(2),
		endDate: daysFromNow(2),
		reason: "Personal day",
		status: "approved",
		createdAt: daysFromNow(-5),
	},
	{
		id: "timeoff-5",
		employeeId: "emp-diego-alvarez",
		employeeName: "Diego Alvarez",
		startDate: daysFromNow(8),
		endDate: daysFromNow(9),
		reason: "Moving help for a family member",
		status: "pending",
		createdAt: daysFromNow(-1),
	},
];

const DEMO_ORDERS = [
	{
		_id: "demo-order-1001",
		userId: "demo-customer",
		status: "pending",
		amount: 48.5,
		createdAt: daysFromNow(0),
		items: [
			{ name: "Avocado & Grain Bowl", quantity: 1, price: 18.5 },
			{ name: "Green Smoothie", quantity: 2, price: 15 },
		],
		address: { firstName: "Avery", lastName: "Customer", city: "San Diego" },
		paymentType: "cod",
	},
	{
		_id: "demo-order-1002",
		status: "pending",
		amount: 26,
		createdAt: daysFromNow(0),
		items: [{ name: "Organic Produce Box", quantity: 1, price: 26 }],
		address: { firstName: "Sam", lastName: "Rivera", city: "Portland" },
		paymentType: "stripe",
		isPaid: true,
	},
	{
		_id: "demo-order-1003",
		status: "preparing",
		amount: 15.75,
		createdAt: daysFromNow(-1),
		items: [{ name: "Herbal Tea Sampler", quantity: 1, price: 15.75 }],
		address: { firstName: "Taylor", lastName: "Lee", city: "Austin" },
		paymentType: "cod",
	},
];

const read = (key, fallback) => {
	try {
		const raw = localStorage.getItem(key);
		if (!raw) return fallback;
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) || parsed ? parsed : fallback;
	} catch {
		return fallback;
	}
};

const write = (key, value) => {
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch {
		// Ignore storage restrictions — in-memory state still works this session.
	}
};

// ---- Messages -------------------------------------------------------------

export const getMessages = (role) => {
	let messages = read(MESSAGES_KEY, null);
	if (!messages) {
		messages = DEMO_MESSAGES;
		write(MESSAGES_KEY, messages);
	}
	return messages.filter((message) => !role || message.toRole === role);
};

export const markMessageRead = (id) => {
	const messages = read(MESSAGES_KEY, DEMO_MESSAGES).map((message) =>
		message.id === id ? { ...message, read: true } : message,
	);
	write(MESSAGES_KEY, messages);
	return messages;
};

export const sendMessage = ({ fromRole, toRole, sender, subject, body }) => {
	const messages = read(MESSAGES_KEY, DEMO_MESSAGES);
	const next = [
		{
			id: `msg-${Date.now()}`,
			fromRole,
			toRole,
			sender: sender || "You",
			subject: subject || "(no subject)",
			body: body || "",
			date: new Date().toISOString(),
			read: false,
		},
		...messages,
	];
	write(MESSAGES_KEY, next);
	return next;
};

// ---- Schedule requests / time off / availability -------------------------

// Keep decisions already made in a browser, but add newer seed requests that
// were introduced after that browser first stored the demo data.
const withSeededRequests = (key, seed) => {
	const stored = read(key, null);
	if (!Array.isArray(stored)) {
		write(key, seed);
		return seed;
	}
	const known = new Set(stored.map((item) => item.id));
	const merged = [...stored, ...seed.filter((item) => !known.has(item.id))];
	if (merged.length !== stored.length) write(key, merged);
	return merged;
};

export const getScheduleRequests = (employeeId) => {
	const requests = withSeededRequests(REQUESTS_KEY, DEMO_REQUESTS);
	return employeeId
		? requests.filter((request) => request.employeeId === employeeId)
		: requests;
};

export const addScheduleRequest = (request) => {
	const requests = read(REQUESTS_KEY, DEMO_REQUESTS);
	const next = [
		{
			id: `req-${Date.now()}`,
			status: "pending",
			createdAt: new Date().toISOString(),
			...request,
		},
		...requests,
	];
	write(REQUESTS_KEY, next);
	return next;
};

export const getTimeOffRequests = (employeeId) => {
	const requests = withSeededRequests(TIMEOFF_KEY, DEMO_TIMEOFF);
	return employeeId
		? requests.filter((request) => request.employeeId === employeeId)
		: requests;
};

// Used by the HR approval queue. The employee portal reads the same store, so
// an approve/deny decision is reflected there on the next render.
export const setTimeOffRequestStatus = (id, status, decisionNote = "") => {
	const requests = getTimeOffRequests().map((request) =>
		request.id === id
			? {
					...request,
					status,
					decisionNote,
					decidedAt: new Date().toISOString(),
				}
			: request,
	);
	write(TIMEOFF_KEY, requests);
	return requests;
};

export const replaceTimeOffRequests = (requests) => {
	write(TIMEOFF_KEY, requests);
	return requests;
};

export const setScheduleRequestStatus = (id, status) => {
	const requests = getScheduleRequests().map((request) =>
		request.id === id ? { ...request, status } : request,
	);
	write(REQUESTS_KEY, requests);
	return requests;
};

export const addTimeOffRequest = (request) => {
	const requests = read(TIMEOFF_KEY, DEMO_TIMEOFF);
	const next = [
		{
			id: `timeoff-${Date.now()}`,
			status: "pending",
			createdAt: new Date().toISOString(),
			...request,
		},
		...requests,
	];
	write(TIMEOFF_KEY, next);
	return next;
};

export const getAvailability = (employeeId = "demo-employee-1") => {
	const availability = read(AVAILABILITY_KEY, {}) || {};
	return availability[employeeId] !== undefined ? availability[employeeId] : true;
};

export const setAvailability = (employeeId, available) => {
	const availability = read(AVAILABILITY_KEY, {}) || {};
	availability[employeeId] = Boolean(available);
	write(AVAILABILITY_KEY, availability);
	return availability;
};

// ---- Demo order status overrides -----------------------------------------

export const getOrderOverrides = () => read(ORDER_OVERRIDES_KEY, {}) || {};

export const setOrderStatusOverride = (orderId, status) => {
	const overrides = getOrderOverrides();
	overrides[orderId] = status;
	write(ORDER_OVERRIDES_KEY, overrides);
	return overrides;
};

export const getDemoOrders = () => read(DEMO_ORDERS_KEY, DEMO_ORDERS) || DEMO_ORDERS;
