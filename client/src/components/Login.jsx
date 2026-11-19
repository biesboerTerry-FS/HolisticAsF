import React, { useState } from "react";
import { SignIn, SignUp } from "@clerk/clerk-react";
import { useAppContext } from "../context/AppContext";

const clerkEnabled = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

const Login = () => {
	const { setShowUserLogin } = useAppContext();
	const [state, setState] = useState("login");

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
							onClick={() => setShowUserLogin(false)}
							className="mt-4 rounded-full bg-primary-forest-green px-4 py-2 text-sm text-primary-warm-white"
						>
							Close
						</button>
					</div>
				) : state === "login" ? (
					<div className="flex flex-col items-center gap-4">
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
