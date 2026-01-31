import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { SignIn, SignUp } from "@clerk/clerk-react";

const Login = () => {
	const { setShowUserLogin } = useAppContext();
	const [state, setState] = useState("login");

	return (
		<div
			onClick={() => setShowUserLogin(false)}
			className="fixed top-0 bottom-0 left-0 right-0 z-50 flex items-center 
         bg-secondary-golden-honey/30 backdrop-blur-xl overflow-y-auto"
		>
			<div
				onClick={(event) => event.stopPropagation()}
				className="m-auto p-4 flex flex-col items-center "
			>
				{state === "login" ? (
					<div className="flex flex-col items-center gap-4 ">
						<SignIn
							routing="hash"
							appearance={{
								variables: {
									colorPrimary: "#2D4B37",
									colorText: "#2D4B37",
									colorBackground: "#F9F6F0",
									colorInputBackground: "#ffffff",
									borderRadius: "0.5rem",
								},
								elements: {
									formButtonPrimary:
										"bg-primary-forest-green hover:bg-primary-sage-green text-sm normal-case",
									card: "bg-primary-sage-green/30 border border-primary-forest-green shadow-none",
									headerTitle: "text-primary-forest-green",
									headerSubtitle:
										"text-primary-forest-green/60",
									socialButtonsBlockButton:
										"border-primary-forest-green text-primary-forest-green",
									footerActionLink:
										"text-secondary-golden-honey hover:text-primary-forest-green",
								},
							}}
						/>
						<p className="text-primary-warm-white bg-primary-forest-green/60 px-4 py-2 rounded-full shadow-md">
							don't have an account?{" "}
							<span
								onClick={() => setState("register")}
								className="cursor-pointer text-secondary-golden-honey font-bold hover:underline"
							>
								sign up
							</span>
						</p>
					</div>
				) : (
					<div className="flex flex-col items-center gap-4">
						<SignUp
							routing="hash"
							signInUrl="#"
							appearance={{
								variables: {
									colorPrimary: "#2D4B37",
									colorText: "#2D4B37",
									colorBackground: "#F9F6F0",
									colorInputBackground: "#ffffff",
									borderRadius: "0.5rem",
								},
								elements: {
									formButtonPrimary:
										"bg-primary-forest-green hover:bg-primary-sage-green text-sm normal-case",
									card: "bg-primary-cream border border-primary-forest-green shadow-none",
									headerTitle: "text-primary-forest-green",
									headerSubtitle:
										"text-primary-forest-green/60",
									socialButtonsBlockButton:
										"border-primary-forest-green text-primary-forest-green",
									footerActionLink:
										"text-secondary-golden-honey hover:text-primary-forest-green",
								},
							}}
						/>
						<p className="text-primary-warm-white bg-primary-forest-green/60 px-4 py-2 rounded-full shadow-md">
							already have an account?{" "}
							<span
								onClick={() => setState("login")}
								className="cursor-pointer text-secondary-golden-honey font-bold hover:underline"
							>
								login
							</span>
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default Login;
