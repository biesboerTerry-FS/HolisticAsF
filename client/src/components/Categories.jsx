import React, { useEffect, useRef, useState } from "react";
import { useAppContext } from "../context/AppContext";

const categoryList = [
	{
		text: "Herbs & Botanicals",
		path: "herbs-botanicals",
		searchTerm: "herbs botanicals",
		subcategories: [
			{ text: "Adaptogens", path: "adaptogens" },
			{ text: "Roots", path: "roots" },
			{ text: "Leaves", path: "leaves" },
		],
	},
	{
		text: "Teas & Tonics",
		path: "teas-tonics",
		searchTerm: "teas tonics",
		subcategories: [
			{ text: "Green Tea", path: "green-tea" },
			{ text: "Calming", path: "calming" },
			{ text: "Herbal", path: "herbal" },
		],
	},
	{
		text: "Superfoods",
		path: "superfoods",
		searchTerm: "superfoods",
		subcategories: [
			{ text: "Seeds", path: "seeds" },
			{ text: "Powders", path: "powders" },
			{ text: "Berries", path: "berries" },
		],
	},
	{
		text: "Supplements",
		path: "supplements",
		searchTerm: "supplements",
		subcategories: [
			{ text: "Minerals", path: "minerals" },
			{ text: "Vitamins", path: "vitamins" },
			{ text: "Gut Health", path: "gut-health" },
		],
	},
	{
		text: "Pantry & Whole Foods",
		path: "pantry-whole-foods",
		searchTerm: "whole foods pantry",
		subcategories: [
			{ text: "Grains", path: "grains" },
			{ text: "Sweeteners", path: "sweeteners" },
			{ text: "Oils", path: "oils" },
		],
	},
	{
		text: "Body & Wellness",
		path: "body-and-wellness",
		searchTerm: "body care wellness",
		subcategories: [
			{ text: "Aromatherapy", path: "aromatherapy" },
			{ text: "Bath", path: "bath" },
			{ text: "Skin", path: "skin" },
		],
	},
];

const Categories = () => {
	const { navigate } = useAppContext();
	const [categories, setCategories] = useState([]);
	const [openCategory, setOpenCategory] = useState(null);
	const [loading, setLoading] = useState(true);
	const containerRef = useRef(null);

	useEffect(() => {
		setCategories(categoryList);
		setLoading(false);
	}, []);

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

	const handleSubcategoryClick = (category, subcategory) => {
		navigate(
			`/products?category=${category.path}&subcategory=${subcategory.path}`,
		);
		setOpenCategory(null);
		scrollTo(0, 0);
	};

	if (loading) {
		return <div className="mt-16 text-center">Loading categories...</div>;
	}

	return (
		<section className="mt-20" ref={containerRef}>
			<div className="flex flex-col gap-2">
				<p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-forest-green/70">
					explore
				</p>
				<h2 className="text-3xl md:text-4xl font-bold tracking-tight text-primary-forest-green">
					shop by{" "}
					<span className="text-secondary-golden-honey">category</span>
				</h2>
			</div>

			<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mt-8 w-full">
				{categories.map((category) => (
					<div key={category.path} className="relative">
						<button
							type="button"
							aria-expanded={openCategory === category.path}
							onClick={() => toggleCategory(category.path)}
							className="group w-full h-full min-h-24 flex flex-col items-start justify-between gap-4 text-left p-4 md:p-5 rounded-2xl bg-primary-warm-white border border-primary-forest-green/10 shadow-sm hover:-translate-y-1 hover:shadow-lg hover:border-secondary-golden-honey/60 transition cursor-pointer focus-visible:outline-2 focus-visible:outline-secondary-golden-honey"
						>
							<span className="text-sm md:text-base font-semibold leading-snug text-primary-forest-green">
								{category.text}
							</span>
							<span className="text-xs text-neutral-medium-gray group-hover:text-secondary-earthy-brown transition">
								{openCategory === category.path
									? "choose a type ↓"
									: "browse →"}
							</span>
						</button>

						{openCategory === category.path &&
							category.subcategories?.length > 0 && (
								<div className="absolute z-50 top-full left-0 mt-2 w-56 rounded-xl bg-primary-warm-white border border-primary-forest-green/10 shadow-xl overflow-hidden">
									<ul className="py-1">
										{category.subcategories.map((sub) => (
											<li key={sub.path}>
												<button
													type="button"
													onClick={() =>
														handleSubcategoryClick(
															category,
															sub,
														)
													}
													className="w-full px-4 py-2.5 text-left text-sm text-primary-forest-green hover:bg-primary-sage-green/20 transition cursor-pointer"
												>
													{sub.text}
												</button>
											</li>
										))}
									</ul>
								</div>
							)}
					</div>
				))}
			</div>
		</section>
	);
};

export default Categories;
