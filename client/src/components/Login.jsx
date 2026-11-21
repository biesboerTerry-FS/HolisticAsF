import React, { useState } from "react";
import { SignIn, SignUp } from "@clerk/clerk-react";
import { useAppContext } from "../context/AppContext";
import { DEMO_EMPLOYEE, EMPLOYEE_STORAGE_KEY } from "../data/employee";

const clerkEnabled = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

const Login = () => {
	const { setShowUserLogin, setIsAdmin, setEmployee, navigate } = useAppContext();
	const [state, setState] = useState("login");

	const handleDemoAdmin = () => {
		setIsAdmin(true);
		setShowUserLogin(false);
		navigate("/admin");
	};

	const handleDemoEmployee = () => {
		try {
			localStorage.setItem(EMPLOYEE_STORAGE_KEY, JSON.stringify(DEMO_EMPLOYEE));
		} catch {
			// ignore storage restrictions
		}
		setEmployee(DEMO_EMPLOYEE);
		setIsAdmin(false);
		setShowUserLogin(false);
		navigate("/employee");
	};

	return (
		<div
			onClick={() => setShowUserLogin(false)}
			className="fixed inset-0 z-50 flex items-center bg-secondary-golden-honey/30 backdrop-blur-xl overflow-y-auto p-4"
		>
			<div onClick={(event) => event.stopPropagation()} className="m-auto flex flex-col items-center gap-4">
				{!clerkEnabled ? (
					<div className="max-w-md rounded-2xl border border-primary-forest-green/15 bg-primary-cream p-6 text-center text-primary-forest-green shadow-lg">
						<p className="text-lg font-semibold">Authentication not configured</p>
						<p className="mt-2 text-sm text-primary-forest-green/75">
							Add <code className="rounded bg-secondary-soft-beige px-1.5 py-0.5">VITE_CLERK_PUBLISHABLE_KEY</code> to{" "}
							<code className="rounded bg-secondary-soft-beige px-1.5 py-0.5">client/.env</code> and restart the client to enable Clerk sign-in.
						</p>
						<button
							onClick={handleDemoAdmin}
							className="mt-4 w-full rounded-full bg-secondary-golden-honey px-4 py-2 text-sm font-semibold text-primary-forest-green transition hover:opacity-90"
						>
							Try demo admin
						</button>
						<button
							onClick={handleDemoEmployee}
							className="mt-2 w-full rounded-full border border-primary-forest-green/30 px-4 py-2 text-sm font-semibold text-primary-forest-green transition hover:bg-primary-forest-green hover:text-primary-warm-white"
						>
							Try demo employee
						</button>
						<button
							onClick={() => setShowUserLogin(false)}
							className="mt-2 rounded-full bg-primary-forest-green px-4 py-2 text-sm text-primary-warm-white"
						>
							Close
						</button>
					</div>
				) : state === "login" ? (
					<div className="flex flex-col items-center gap-4">
						<button
							onClick={handleDemoAdmin}
							className="rounded-full border border-primary-forest-green/30 bg-secondary-soft-beige px-4 py-2 text-xs font-semibold text-primary-forest-green transition hover:bg-primary-forest-green hover:text-primary-warm-white"
						>
							Try demo admin
						</button>
						<button
							onClick={handleDemoEmployee}
							className="rounded-full border border-primary-forest-green/30 bg-secondary-soft-beige px-4 py-2 text-xs font-semibold text-primary-forest-green transition hover:bg-primary-forest-green hover:text-primary-warm-white"
						>
							Try demo employee
						</button>
						<SignIn
							routing="hash"
							appearance={{
								variables: {
									colorPrimary: "#172033",
									colorText: "#172033",
									colorBackground: "#F5F7FB",
									colorInputBackground: "#ffffff",
									borderRadius: "0.5rem",
								},
								elements: {
									formButtonPrimary:
										"bg-primary-forest-green hover:bg-primary-sage-green text-sm normal-case",
									card: "bg-primary-sage-green/30 border border-primary-forest-green shadow-none",
								},
							}}
						/>
						<p className="rounded-full bg-primary-forest-green/60 px-4 py-2 text-primary-warm-white shadow-md">
							don&apos;t have an account?{" "}
							<button
								onClick={() => setState("register")}
								className="cursor-pointer font-bold text-secondary-golden-honey hover:underline"
							>
								sign up
							</button>
						</p>
					</div>
				) : (
					<div className="flex flex-col items-center gap-4">
						<SignUp
							routing="hash"
							signInUrl="#"
							appearance={{
								variables: {
									colorPrimary: "#172033",
									colorText: "#172033",
									colorBackground: "#F5F7FB",
									colorInputBackground: "#ffffff",
									borderRadius: "0.5rem",
								},
								elements: {
									formButtonPrimary:
										"bg-primary-forest-green hover:bg-primary-sage-green text-sm normal-case",
									card: "bg-primary-cream border border-primary-forest-green shadow-none",
								},
							}}
						/>
						<p className="rounded-full bg-primary-forest-green/60 px-4 py-2 text-primary-warm-white shadow-md">
							already have an account?{" "}
							<button
								onClick={() => setState("login")}
								className="cursor-pointer font-bold text-secondary-golden-honey hover:underline"
							>
								login
							</button>
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default Login;
