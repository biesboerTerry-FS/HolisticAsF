import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Link, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import ProductCard from "../components/ProductCard";

const ProductDetails = () => {
	const { products, navigate, currency, addToCart } = useAppContext();
	const { id } = useParams();

	const [relatedProducts, setRelatedProducts] = useState([]);
	const [thumbnail, setThumbnail] = useState(null);

	const product = products.find((item) => item._id === id || item.upc === id);

	useEffect(() => {
		if (product && products.length > 0) {
			const productsCopy = products.filter(
				(item) =>
					product.category === item.category &&
					(item._id || item.upc) !== id,
			);
			setRelatedProducts(productsCopy.slice(0, 5));
		}
	}, [products, product, id]);

	useEffect(() => {
		if (product?.image) {
			const imageUrl = Array.isArray(product.image)
				? product.image[0]
				: product.image;
			setThumbnail(imageUrl);
		} else {
			setThumbnail(assets.leaf);
		}
	}, [product]);

	if (!product) return <div className="mt-12 text-center">Loading...</div>;

	const regularPrice =
		product.regularPrice ?? product.price?.regular ?? product.price ?? 0;

	const salePrice = product.offerPrice ?? product.price?.sale ?? regularPrice;

	const imageArray = Array.isArray(product.image)
		? product.image
		: product.image
			? [product.image]
			: [assets.leaf];

	return (
		<div className="mt-12">
			<p>
				<Link to={"/"}>home</Link> /
				<Link to={"/products"}> products</Link> /
				<Link to={`/products/${product.category?.toLowerCase()}`}>
					{product.category?.toLowerCase()}
				</Link>{" "}
				/
				<span className="text-primary-forest-green">
					{product.name?.toLowerCase()}
				</span>
			</p>

			<div className="flex flex-col md:flex-row gap-16 mt-4">
				<div className="flex gap-3">
					<div className="flex flex-col gap-3">
						{imageArray.length > 1 &&
							imageArray.map((image, index) => (
								<div
									key={index}
									onClick={() => setThumbnail(image)}
									className="border max-w-24 border-gray-500/30 rounded overflow-hidden cursor-pointer"
								>
									<img
										src={image}
										alt={`Thumbnail ${index + 1}`}
										onError={(e) => {
											e.target.src = assets.leaf;
										}}
									/>
								</div>
							))}
					</div>

					<div className="border border-gray-500/30 max-w-100 rounded overflow-hidden">
						<img
							src={thumbnail || assets.leaf}
							alt="selected product"
							className="w-full h-full object-cover"
							onError={(e) => {
								e.target.src = assets.leaf;
							}}
						/>
					</div>
				</div>

				<div className="text-sm w-full md:w-1/2">
					<h1 className="text-3xl font-medium">
						{product.name?.toLowerCase()}
					</h1>
					<div className="mt-6">
						<p className="text-primary-forest-green/70 line-through">
							original price: {currency}
							{regularPrice.toFixed(2)}
						</p>
						<p className="text-2xl font-medium">
							sale price: {currency}
							{salePrice.toFixed(2)}
						</p>
						<span className="text-primary-forest-green/70">
							(plus tax)
						</span>
					</div>

					<p className="text-base font-medium mt-6">
						about
						<span className="font-medium text-secondary-golden-honey">
							{" "}
							{product.name?.toLowerCase()}
						</span>
					</p>

					{product.description && (
						<p className="text-primary-forest-green/80 mt-2 text-sm">
							{product.description.toLowerCase()}
						</p>
					)}

					{product.brand && (
						<p className="text-sm text-primary-forest-green/70 mt-2">
							brand:{" "}
							<span className="text-primary-forest-green">
								{product.brand.toLowerCase()}
							</span>
						</p>
					)}

					<div className="flex items-center mt-10 gap-4 text-base">
						<button
							onClick={() =>
								addToCart(product._id || product.upc)
							}
							className="w-full py-3.5 cursor-pointer font-medium bg-primary-sage-green/90 text-primary-warm-white hover:bg-primary-forest-green transition"
						>
							add to cart
						</button>
						<button
							onClick={() => {
								addToCart(product._id || product.upc);
								navigate("/cart");
							}}
							className="w-full py-3.5 cursor-pointer font-medium bg-primary-sage-green/90 text-primary-warm-white hover:bg-primary-forest-green transition"
						>
							buy now
						</button>
					</div>
				</div>
			</div>

			{relatedProducts.length > 0 && (
				<div className="flex flex-col items-center mt-20">
					<div className="flex flex-col items-center w-max">
						<p className="text-secondary-golden-honey text-3xl font-medium">
							related{" "}
							<span className="text-primary-forest-green text-3xl font-medium">
								{" "}
								products
							</span>
						</p>
						<div className="w-20 h-0.5 bg-primary-sage-green rounded-full mt-2"></div>
					</div>

					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6 w-full">
						{relatedProducts.map((product, index) => (
							<ProductCard key={index} product={product} />
						))}
					</div>

					<button
						onClick={() => {
							navigate("/products");
							scrollTo(0, 0);
						}}
						className="mx-auto cursor-pointer px-12 my-16 py-2.5 border rounded text-primary-forest-green hover:bg-primary-forest-green/10"
					>
						see more
					</button>
				</div>
			)}
		</div>
	);
};

export default ProductDetails;
