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

	const product = products.find((item) => item._id === id);

	useEffect(() => {
		if (product && products.length > 0) {
			let productsCopy = products.slice();
			productsCopy = productsCopy.filter(
				(item) => product.category === item.category,
			);
			setRelatedProducts(productsCopy.slice(0, 5));
		}
	}, [products, product]);

	useEffect(() => {
		setThumbnail(product?.image[0] ? product.image[0] : null);
	}, [product]);

	if (!product) {
		return <div className="mt-12 text-center">Loading...</div>;
	}

	return (
		product && (
			<div className="mt-12">
				<p>
					<Link to={"/"}>home</Link> /
					<Link to={"/products"}> products</Link> /
					<Link to={`/products/${product.category}`}>
						{" "}
						{product.category}
					</Link>{" "}
					/
					<span className="text-primary-forest-green">
						{" "}
						{product.name}
					</span>
				</p>

				<div className="flex flex-col md:flex-row gap-16 mt-4">
					<div className="flex gap-3">
						<div className="flex flex-col gap-3">
							{product.image.map((image, index) => (
								<div
									key={index}
									onClick={() => setThumbnail(image)}
									className="border max-w-24 border-gray-500/30 rounded overflow-hidden cursor-pointer"
								>
									<img
										src={image}
										alt={`Thumbnail ${index + 1}`}
									/>
								</div>
							))}
						</div>

						<div className="border border-gray-500/30 max-w-100 rounded overflow-hidden">
							<img
								src={thumbnail}
								alt="selected product"
								className="w-full h-full object-cover"
							/>
						</div>
					</div>

					<div className="text-sm w-full md:w-1/2">
						<h1 className="text-3xl font-medium">{product.name}</h1>

						<div className="flex items-center gap-0.5 mt-1">
							{Array(5)
								.fill("")
								.map((_, i) => (
									<img
										key={i}
										className="md:w-4 w-3.5"
										src={
											i < 4
												? assets.star_icon
												: assets.star_dull_icon
										}
										alt=""
									/>
								))}
							<p className="text-base ml-2">(4)</p>
						</div>

						<div className="mt-6">
							<p className="text-primary-forest-green/70 line-through">
								original price: {currency}
								{product.price}
							</p>
							<p className="text-2xl font-medium">
								sale price: {currency}
								{product.offerPrice}
							</p>
							<span className="text-primary-forest-green/70">
								(plus tax)
							</span>
						</div>

						<p className="text-base font-medium mt-6">
							about
							<span className="font-medium text-secondary-golden-honey">
								{" "}
								{product.name}
							</span>
						</p>
						<ul className="list-disc ml-4 text-primary-forest-green/80">
							{product.description.map((desc, index) => (
								<li key={index}>{desc}</li>
							))}
						</ul>

						<div className="flex items-center mt-10 gap-4 text-base">
							<button
								onClick={() => addToCart(product._id)}
								className="w-full py-3.5 cursor-pointer font-medium bg-primary-sage-green/90 text-primary-warm-white hover:bg-primary-forest-green transition"
							>
								add to cart
							</button>
							<button
								onClick={() => {
									addToCart(product._id);
									navigate("/cart");
								}}
								className="w-full py-3.5 cursor-pointer font-medium bg-primary-sage-green/90 text-primary-warm-white hover:bg-primary-forest-green transition"
							>
								buy now
							</button>
						</div>
					</div>
				</div>

				{/* related products */}
				<div className="flex flex-col items-center mt-20">
					<div className="flex flex-col items-center w-max">
						<p className="text-secondary-golden-honey text-3xl font-medium">
							related{" "}
							<span className="text-primary-forest-green text-3xl font-medium">
								{" "}
								products
							</span>{" "}
						</p>
						<div className="w-20 h-0.5 bg-primary-sage-green rounded-full mt-2"></div>
					</div>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6 w-full">
						{relatedProducts
							.filter((product) => product.inStock)
							.map((product, index) => (
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
			</div>
		)
	);
};

export default ProductDetails;
