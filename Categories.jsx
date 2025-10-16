import React from "react";
import { useAppContext } from "../context/AppContext";
import { categories } from "../assets/assets";
import search from "../assets/search.svg";

const Categories = () => {
	const { navigate } = useAppContext();

	return (
		<div className="mt-16">
			<p className="text-2xl md:text-3xl font-medium text-[#2d5b3e] ">
				categories
			</p>
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 mt-6 gap-6">
				{categories.map((category, index) => (
					<div
						key={index}
						className="group cursor-pointer py-5 px-3 gap-2 rounded-lg flex flex-col justify-center items-center shadow-[0_25px_50px_-12px_rgba(0,0,0,0.35)]"
						style={{ backgroundColor: category.bgColor }}
						onClick={() => {
							navigate(
								`/products/${category.path.toLowerCase()}`
							);
							scrollTo(0, 0);
						}}
					>
						<img
							className="group-hover:scale-110 transition max-w-28"
							src={search}
							alt={category.text}
						/>
						<p className="text-md font-medium text-[#2d5b3e] text-[#f5f5dc]">
							{category.text}
						</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default Categories;
