import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const ThemeToggle = () => {
	const [dark, setDark] = useState(() =>
		document.documentElement.classList.contains("dark"),
	);

	useEffect(() => {
		document.documentElement.classList.toggle("dark", dark);
		try {
			localStorage.setItem("theme", dark ? "dark" : "light");
		} catch (e) {}
	}, [dark]);

	return (
		<button
			type="button"
			onClick={() => setDark((prev) => !prev)}
			aria-label={dark ? "switch to light mode" : "switch to dark mode"}
			title={dark ? "light mode" : "dark mode"}
			className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-full border border-primary-forest-green hover:bg-primary-forest-green hover:text-primary-warm-white transition"
		>
			{dark ? <Sun size={16} /> : <Moon size={16} />}
		</button>
	);
};

export default ThemeToggle;
