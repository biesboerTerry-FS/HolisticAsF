// Account data for /profile.
//
// Backend is the source of truth whenever a JWT session is available. Every
// write is also mirrored to localStorage so the storefront stays fully usable
// as a demo when the API (or Clerk) is not configured.

const PROFILE_KEY = "holisticaf-profile";
const ADDRESSES_KEY = "holisticaf-addresses";
const PAYMENTS_KEY = "holisticaf-payment-methods";

const SEED_PROFILE = {
	name: "Demo Shopper",
	email: "demo@holisticaf.local",
	phone: "",
};

const SEED_ADDRESS = {
	id: "demo-address-1",
	label: "Home",
	line1: "123 Wellness Way",
	line2: "",
	city: "San Francisco",
	state: "CA",
	zip: "94103",
	country: "US",
	firstName: "Demo",
	lastName: "Shopper",
	phone: "555-0100",
	email: "demo@holisticaf.local",
	isDefault: true,
};

const SEED_PAYMENT = {
	id: "demo-card-4242",
	brand: "Test card",
	last4: "4242",
	exp: "12/30",
	label: "Test card",
	isDefault: true,
	demo: true,
};

const read = (key, fallback) => {
	try {
		const raw = localStorage.getItem(key);
		if (!raw) return fallback;
		const parsed = JSON.parse(raw);
		return parsed ?? fallback;
	} catch {
		return fallback;
	}
};

const write = (key, value) => {
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch {
		// Storage can be disabled — in-memory state still works.
	}
};

export const readLocalProfile = (user) => ({
	name: user?.name || SEED_PROFILE.name,
	email: user?.email || SEED_PROFILE.email,
	phone: "",
	...read(PROFILE_KEY, {}),
});
export const readLocalAddresses = () => {
	const value = read(ADDRESSES_KEY, null);
	return Array.isArray(value) ? value : [SEED_ADDRESS];
};
export const readLocalPayments = () => {
	const value = read(PAYMENTS_KEY, null);
	return Array.isArray(value) ? value : [SEED_PAYMENT];
};

export const writeLocalProfile = (profile) => write(PROFILE_KEY, profile);
export const writeLocalAddresses = (addresses) => write(ADDRESSES_KEY, addresses);
export const writeLocalPayments = (methods) => write(PAYMENTS_KEY, methods);

const localId = (prefix) =>
	`${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const request = async (axios, method, url, data) => {
	const response = await axios({
		method,
		url,
		data,
		suppressGlobalErrorToast: true,
	});
	if (!response.data?.success) {
		throw new Error(response.data?.message || "Request failed.");
	}
	return response.data;
};

const pickProfile = (user = {}) => ({
	name: user.name || "",
	email: user.email || "",
	phone: user.phone || "",
});

/**
 * Establish a backend session (a demo JWT when signed out) and hydrate all
 * three sections. Falls back to the local mirror on any failure.
 */
export const bootstrapProfile = async (axios, user) => {
	let backend = false;

	try {
		if (user) {
			await request(axios, "get", "/api/user/profile");
		} else {
			await request(axios, "post", "/api/user/demo-login", {});
		}
		backend = true;
	} catch {
		backend = false;
	}

	if (backend) {
		try {
			const [profileRes, addressRes, paymentRes] = await Promise.all([
				request(axios, "get", "/api/user/profile"),
				request(axios, "get", "/api/address/get-addresses"),
				request(axios, "get", "/api/payment-methods"),
			]);
			const profile = pickProfile(profileRes.user);
			const addresses = Array.isArray(addressRes.addresses) ? addressRes.addresses : [];
			const paymentMethods = Array.isArray(paymentRes.paymentMethods)
				? paymentRes.paymentMethods
				: [SEED_PAYMENT];

			writeLocalProfile(profile);
			writeLocalAddresses(addresses);
			writeLocalPayments(paymentMethods);
			return { profile, addresses, paymentMethods, backend: true };
		} catch {
			backend = false;
		}
	}

	return {
		profile: readLocalProfile(user),
		addresses: readLocalAddresses(),
		paymentMethods: readLocalPayments(),
		backend: false,
	};
};

const settle = async (axios, backend, call) => {
	if (!backend) return { backend: false };
	try {
		const data = await call();
		return { backend: true, data };
	} catch (error) {
		return { backend: false, error: error.message };
	}
};

export const saveProfile = async (axios, backend, profile) => {
	writeLocalProfile(profile);
	const result = await settle(axios, backend, () =>
		request(axios, "patch", "/api/user/profile", profile),
	);
	const next = result.data?.user
		? { ...profile, ...pickProfile(result.data.user) }
		: profile;
	writeLocalProfile(next);
	return { profile: next, ...result };
};

export const addAddress = async (axios, backend, address) => {
	const tempId = localId("local-address");
	const optimistic = { ...address, id: tempId, _id: tempId };
	const result = await settle(axios, backend, () =>
		request(axios, "post", "/api/address/add-address", address),
	);
	const saved = result.data?.address || optimistic;
	return { address: saved, ...result };
};

export const editAddress = async (axios, backend, id, address) => {
	const result = await settle(axios, backend, () =>
		request(axios, "patch", `/api/address/${id}`, address),
	);
	return { address: result.data?.address || address, ...result };
};

export const removeAddress = async (axios, backend, id) =>
	settle(axios, backend, () => request(axios, "delete", `/api/address/${id}`));

export const makeDefaultAddress = async (axios, backend, id) =>
	settle(axios, backend, () => request(axios, "post", `/api/address/${id}/default`));

export const addPaymentMethod = async (axios, backend, method) => {
	const optimistic = { ...method, id: localId("local-card"), demo: true };
	const result = await settle(axios, backend, () =>
		request(axios, "post", "/api/payment-methods", method),
	);
	return { method: result.data?.paymentMethod || optimistic, ...result };
};

export const removePaymentMethod = async (axios, backend, id) =>
	settle(axios, backend, () => request(axios, "delete", `/api/payment-methods/${id}`));

export const makeDefaultPaymentMethod = async (axios, backend, id) =>
	settle(axios, backend, () =>
		request(axios, "patch", `/api/payment-methods/${id}`, { isDefault: true }),
	);
