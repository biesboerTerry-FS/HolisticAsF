import React from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "../context/AppContext";

const TopSellers = () => {
	const { products } = useAppContext();

	return (
		<div className="mt-16 max-[300px]:hidden">
			<p className="text-2xl md:text-3xl font-medium text-primary-forest-green">
				top sellers
			</p>
			<div className="grid grid-cols-1 min-[608px]:grid-cols-2 min-[969px]:grid-cols-3 min-[1360px]:grid-cols-5 gap-6 mt-16 place-items-center max-[608px]:px-[1%]">
				{/* {products
					.filter((product) => product.inStock)
					.splice(0, 5)
					.map((product, index) => (
						<ProductCard key={index} product={product} />
					))} */}
				{products && products.length > 0
					? products
							.filter((product) => product.inStock)
							.slice(0, 5)
							.map((product, index) => (
								<ProductCard key={index} product={product} />
							))
					: null}
			</div>
		</div>
	);
};

export default TopSellers;
