import "./index.css";
import App from "./App.jsx";
import "react-toastify/dist/ReactToastify.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { ClerkAppContextProvider, LocalAppContextProvider } from "./context/AppContext.jsx";
import { installHttpErrorHandling } from "./utils/http";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

installHttpErrorHandling();

const root = createRoot(document.getElementById("root"));

if (PUBLISHABLE_KEY) {
	root.render(
		<BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
			<ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
				<ClerkAppContextProvider>
					<App />
				</ClerkAppContextProvider>
			</ClerkProvider>
		</BrowserRouter>,
	);
} else {
	root.render(
		<BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
			<LocalAppContextProvider>
				<App />
			</LocalAppContextProvider>
		</BrowserRouter>,
	);
}
