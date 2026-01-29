import React, { useEffect, useRef, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets, categories } from "../assets/assets";

const Categories = () => {
	const { navigate } = useAppContext();
	const [openCategory, setOpenCategory] = useState(null);
	const containerRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(e.target)
			) {
				setOpenCategory(null);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const toggleCategory = (categoryPath) => {
		setOpenCategory((prev) =>
			prev === categoryPath ? null : categoryPath,
		);
	};
	return (
		<div className="mt-16" ref={containerRef}>
			<p className="text-2xl md:text-3xl font-medium text-primary-forest-green">
				categories
			</p>

			{/* EVEN SPACING */}
			<div className="flex justify-between flex-wrap gap-y-6 mt-6">
				{categories.map((category, index) => (
					<div key={index} className="relative">
						{/* CATEGORY BUTTON */}
						<div
							className="group cursor-pointer py-5 px-6 rounded-lg shadow-[0_25px_50px_-12px_rgba(0,0,0,0.35)] bg-primary-sage-green"
							onClick={() => toggleCategory(category.path)}
						>
							<p className="text-md font-medium text-secondary-soft-beige group-hover:text-primary-forest-green">
								{category.text}
							</p>
						</div>

						{/* DROPDOWN */}
						{openCategory === category.path &&
							category.subcategories?.length > 0 && (
								<div className="absolute z-50 mt-2 w-48 rounded-md bg-primary-cream shadow-lg">
									<ul className="py-2">
										{category.subcategories.map(
											(sub, i) => (
												<li
													key={i}
													onClick={() => {
														navigate(
															`/products/${category.path}/${sub.path}`,
														);
														setOpenCategory(null);
														scrollTo(0, 0);
													}}
													className="px-4 py-2 cursor-pointer text-sm text-primary-forest-green hover:bg-primary-sage-green/30"
												>
													{sub.text}
												</li>
											),
										)}
									</ul>
								</div>
							)}
					</div>
				))}
			</div>
		</div>
	);
};

export default Categories;
