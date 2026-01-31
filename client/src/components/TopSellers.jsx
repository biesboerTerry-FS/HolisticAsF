import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "../context/AppContext";

const TopSellers = () => {
	const { products } = useAppContext();
	const [featuredProducts, setFeaturedProducts] = useState([]);

	useEffect(() => {
		if (products && products.length > 0) {
			setFeaturedProducts(products.slice(0, 5));
		}
	}, [products]);

	if (!featuredProducts || featuredProducts.length === 0) return null;

	return (
		<div className="mt-16 max-[300px]:hidden">
			<div className="flex flex-col items-center w-max">
				<p className="text-secondary-golden-honey text-3xl font-medium">
					top{" "}
					<span className="text-primary-forest-green text-3xl font-medium">
						sellers
					</span>
				</p>
				<div className="w-20 h-0.5 bg-primary-sage-green rounded-full mt-2"></div>
			</div>

			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6 w-full">
				{featuredProducts.map((product, index) => (
					<ProductCard key={index} product={product} />
				))}
			</div>
		</div>
	);
};

export default TopSellers;
