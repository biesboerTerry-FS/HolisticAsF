// Demo sessions still get a real, short-lived server-issued JWT so protected
// routes can stay protected. Failures are swallowed: the portals fall back to
// their existing local demo data when the backend is unavailable.
export async function ensureDemoAdminToken(axios) {
	try {
		await axios.post(
			"/api/admin/demo-login",
			{},
			{ suppressGlobalErrorToast: true },
		);
	} catch {
		// Backend unavailable — local demo mode continues.
	}
}

export async function ensureDemoEmployeeToken(axios, employeeId) {
	try {
		await axios.post(
			"/api/employees/demo-login",
			{ employeeId },
			{ suppressGlobalErrorToast: true },
		);
	} catch {
		// Backend unavailable — local demo mode continues.
	}
}
