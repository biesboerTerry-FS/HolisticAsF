import React from "react";
import ProductCard from "./ProductCard";
import Card from "./Card";
import { useAppContext } from "../context/AppContext";

const TopSellers = () => {
	const { products } = useAppContext();

	return (
		<div className="mt-16 max-[300px]:hidden">
			<p className="text-2xl md:text-3xl font-medium text-[#2d5b3e]">
				top sellers
			</p>
			<div className="grid grid-cols-1 min-[608px]:grid-cols-2 min-[969px]:grid-cols-3 min-[1360px]:grid-cols-4 gap-6 mt-16 place-items-center max-[608px]:px-[1%]">
				{products
					.filter((product) => product.inStock)
					.splice(0, 4)
					.map((product, index) => (
						<Card key={index} product={product} />
					))}
			</div>
		</div>
	);
};

export default TopSellers;
