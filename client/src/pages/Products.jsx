import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import ProductCard from "../components/ProductCard";

const Products = () => {
	const { products, searchQuery, setSearchQuery } = useAppContext();
	const [filteredProducts, setFilteredProducts] = useState([]);

	useEffect(() => {
		if (searchQuery.length > 0) {
			setFilteredProducts(
				products.filter((product) =>
					product.name
						.toLowerCase()
						.includes(searchQuery.toLowerCase())
				)
			);
		} else {
			setFilteredProducts(products);
		}
	}, [searchQuery, products]);

	return (
		<div className="mt-16 flex flex-col flex-auto">
			<div className="flex flex-col flex-auto items-end w-max">
				<p className="text-secondary-golden-honey text-2xl font-medium">
					all{" "}
					<span className="text-primary-forest-green">products</span>
				</p>
				<div className="w-16 h-0.5 bg-primary-sage-green rounded-full"></div>
			</div>

			<div
				className="grid grid-cols-1 sm:grid-cols-2 md:justify-around sm:justify-center
			 md:grid-cols-3 gap-1.5 md:gap-3 lg:grid-cols-4 mt-6"
			>
				{filteredProducts
					.filter((product) => product.inStock)
					.map((product, index) => (
						<ProductCard key={index} product={product} />
					))}
			</div>
		</div>
	);
};

export default Products;
