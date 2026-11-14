import axios from "axios";
import toast from "react-hot-toast";

export function getHttpErrorMessage(error, fallback = "Something went wrong") {
	if (!error) return fallback;

	// Axios error with server response
	if (error.response) {
		const { data, status, statusText } = error.response;
		if (typeof data === "string" && data.trim()) return data;
		if (data?.message) return data.message;
		if (data?.error) return data.error;
		return `Request failed (${status}${statusText ? ` ${statusText}` : ""})`;
	}

	// Request made but no response
	if (error.request) {
		return "Network error: unable to reach the server. Please check your connection.";
	}

	// Something else
	return error.message || fallback;
}

let interceptorsInstalled = false;

export function installHttpErrorHandling(instance = axios) {
	if (interceptorsInstalled) return;
	interceptorsInstalled = true;

	instance.interceptors.response.use(
		(response) => response,
		(error) => {
			const config = error.config || {};
			// Allow callers to suppress global toast for handled cases
			if (!config.suppressGlobalErrorToast) {
				const message = getHttpErrorMessage(error);
				toast.error(message);
			}
			return Promise.reject(error);
		},
	);
}
