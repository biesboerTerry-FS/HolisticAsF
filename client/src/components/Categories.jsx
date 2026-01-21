import React from "react";
import { useAppContext } from "../context/AppContext";
import { assets, categories } from "../assets/assets";

const Categories = () => {
	const { navigate } = useAppContext();

	return (
		<div className="mt-16">
			<p className="text-2xl md:text-3xl font-medium text-primary-forest-green ">
				categories
			</p>
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 mt-6 gap-6">
				{categories.map((category, index) => (
					<div
						key={index}
						className="group cursor-pointer py-5 px-3 gap-2 rounded-lg flex flex-col justify-center items-center shadow-[0_25px_50px_-12px_rgba(0,0,0,0.35)] bg-primary-sage-green"
						onClick={() => {
							navigate(
								`/products/${category.path.toLowerCase()}`
							);
							scrollTo(0, 0);
						}}
					>
						<p className="text-md font-medium text-secondary-soft-beige hover:text-primary-forest-green">
							{category.text}
						</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default Categories;
