import React, { useEffect, useRef, useState } from "react";
import { useAppContext } from "../context/AppContext";

const Categories = () => {
	const { navigate } = useAppContext();
	const [categories, setCategories] = useState([]);
	const [openCategory, setOpenCategory] = useState(null);
	const [loading, setLoading] = useState(true);
	const containerRef = useRef(null);

	const krogerCategories = [
		{
			text: "Fresh",
			path: "fresh",
			searchTerm: "fresh produce",
			subcategories: [
				{ text: "Vegetables", path: "vegetables" },
				{ text: "Fruits", path: "fruits" },
				{ text: "Herbs & Seasonings", path: "herbs" },
			],
		},
		{
			text: "Grocery",
			path: "grocery",
			searchTerm: "pantry staples",
			subcategories: [
				{ text: "Grains & Pasta", path: "grains" },
				{ text: "Canned Goods", path: "canned" },
				{ text: "Snacks", path: "snacks" },
			],
		},
		{
			text: "Meat & Seafood",
			path: "meat-seafood",
			searchTerm: "meat protein",
			subcategories: [
				{ text: "Beef", path: "beef" },
				{ text: "Chicken", path: "chicken" },
				{ text: "Seafood", path: "seafood" },
			],
		},
		{
			text: "Dairy & Eggs",
			path: "dairy",
			searchTerm: "milk cheese butter",
			subcategories: [
				{ text: "Milk & Milk Alternatives", path: "milk" },
				{ text: "Cheese", path: "cheese" },
				{ text: "Eggs & Dairy", path: "eggs" },
			],
		},
		{
			text: "Bakery",
			path: "bakery",
			searchTerm: "bread bakery",
			subcategories: [
				{ text: "Bread", path: "bread" },
				{ text: "Pastries", path: "pastries" },
				{ text: "Cakes & Pies", path: "cakes" },
			],
		},
		{
			text: "Health & Beauty",
			path: "health-beauty",
			searchTerm: "health personal care",
			subcategories: [
				{ text: "Vitamins & Supplements", path: "vitamins" },
				{ text: "Personal Care", path: "personal-care" },
				{ text: "Beauty", path: "beauty" },
			],
		},
	];

	useEffect(() => {
		setCategories(krogerCategories);
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

	const handleCategoryClick = (category) => {
		navigate(
			`/products?category=${category.path}&search=${category.searchTerm}`,
		);
		setOpenCategory(null);
		scrollTo(0, 0);
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
		<div className="mt-16" ref={containerRef}>
			<div className="flex flex-col items-center w-max">
				<p className="text-secondary-golden-honey text-3xl font-medium">
					shop by{" "}
					<span className="text-primary-forest-green text-3xl font-medium">
						category
					</span>
				</p>
				<div className="w-20 h-0.5 bg-primary-sage-green rounded-full mt-2"></div>
			</div>

			<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mt-8 w-full">
				{categories.map((category, index) => (
					<div key={index} className="relative">
						<div
							className="group cursor-pointer py-4 px-3 rounded-lg shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] bg-primary-sage-green hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] transition-shadow"
							onClick={() => toggleCategory(category.path)}
						>
							<p className="text-sm md:text-base font-medium text-secondary-soft-beige group-hover:text-primary-forest-green text-center">
								{category.text}
							</p>
						</div>

						{openCategory === category.path &&
							category.subcategories?.length > 0 && (
								<div className="absolute z-50 top-full left-0 mt-2 w-48 rounded-md bg-primary-sage-green/20 border border-primary-sage-green/40 shadow-lg">
									<ul className="py-1">
										{category.subcategories.map(
											(sub, i) => (
												<li
													key={i}
													onClick={() =>
														handleSubcategoryClick(
															category,
															sub,
														)
													}
													className="px-4 py-2 cursor-pointer text-sm text-primary-forest-green hover:bg-primary-sage-green/20 transition-colors"
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
