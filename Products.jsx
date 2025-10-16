import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import Card from "../components/Card";
import { dummyProducts } from "../assets/assets";

const Products = () => {
	const { products, searchQuery } = useAppContext();

	// const [filteredProducts, setFilteredProducts] = useState([]);

	// useEffect(() => {
	// 	if (searchQuery.length > 0) {
	// 		setFilteredProducts(
	// 			products.filter((product) =>
	// 				product.name
	// 					.toLowerCase()
	// 					.includes(searchQuery.toLowerCase())
	// 			)
	// 		);
	// 	} else {
	// 		setFilteredProducts(products);
	// 	}
	// }, [products, searchQuery]);

	return (
		<div className="mt-16 flex flex-col">
			<div className="flex flex-col items-center w-max">
				<p className="text-2xl font-medium">all products</p>
				<div className="w-16 h-0.5 bg-primary rounded-full"></div>
			</div>

			<div className="grid grid-cols-1 min-[608px]:grid-cols-2 min-[969px]:grid-cols-3 min-[1360px]:grid-cols-4 gap-6 mt-16 place-items-center max-[608px]:px-[1%]">
				{dummyProducts
					.filter((product) => product.inStock)
					.map((product, index) => (
						<Card key={index} product={product} />
					))}
			</div>
		</div>
	);
};

export default Products;
