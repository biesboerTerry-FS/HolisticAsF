const STORAGE_KEY = "holisticaf_cookie_consent";
const CONSENT_VERSION = 1;

const defaultConsent = () => ({
	version: CONSENT_VERSION,
	timestamp: null,
	essential: true,
	analytics: false,
	marketing: false,
	decision: null, // "accepted" | "declined" | "custom" | null
});

export const getConsent = () => {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		if (typeof parsed === "object" && parsed && parsed.version === CONSENT_VERSION) {
			return { ...defaultConsent(), ...parsed, essential: true };
		}
		return null;
	} catch {
		return null;
	}
};

export const hasConsentDecision = () => {
	const consent = getConsent();
	return Boolean(consent && consent.decision);
};

export const setConsent = (partial) => {
	const prev = getConsent() || defaultConsent();
	const next = {
		...prev,
		...partial,
		version: CONSENT_VERSION,
		timestamp: new Date().toISOString(),
		essential: true,
	};
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
	} catch {
		// storage can be unavailable; in-memory state still applies
	}
	window.dispatchEvent(new CustomEvent("holisticaf-consent-change", { detail: next }));
	return next;
};

export const openConsentSettings = () => {
	window.dispatchEvent(new Event("holisticaf-consent-open"));
};

export const onConsentOpen = (handler) => {
	window.addEventListener("holisticaf-consent-open", handler);
	return () => window.removeEventListener("holisticaf-consent-open", handler);
};
