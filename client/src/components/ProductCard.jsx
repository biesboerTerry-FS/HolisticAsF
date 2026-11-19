import React from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const ProductCard = ({ product }) => {
	const { currency, addToCart, removeFromCart, cartItems, navigate } =
		useAppContext();

	if (!product) return null;

	const regularPrice =
		product.regularPrice?.regular ??
		product.price?.regular ??
		product.price ??
		0;

	const offerPrice =
		product.offerPrice ?? product.price?.sale ?? regularPrice;

	const resolveImage = () => {
		if (product.image) {
			return Array.isArray(product.image)
				? product.image[0]
				: product.image;
		}

		if (product.upc) {
			return `/api/media/image?upc=${product.upc}`;
		}

		return assets.leaf;
	};

	const imageSrc = resolveImage();

	const handleNavigation = () => {
		if (product?.category && (product._id || product.upc)) {
			navigate(
				`/products/${product.category?.toLowerCase()}/${product._id?.toLowerCase() || product.upc}`,
			);
			scrollTo(0, 0);
		}
	};

	return (
		<div
			onClick={handleNavigation}
			className="border border-primary-forest-green bg-primary-sage-green/40 rounded-md md:px-4 px-3 py-2 min-w-28 max-w-52 w-full cursor-pointer"
		>
			<div className="group w-full h-32 md:h-40 overflow-hidden rounded-md bg-primary-warm-white">
				<img
					className="w-full h-full object-cover group-hover:scale-105 transition"
					src={imageSrc}
					alt={product.name || "product image"}
					onError={(event) => {
						event.target.src = assets.leaf;
					}}
				/>
			</div>

			<div className="text-primary-forest-green/60 text-sm mt-2">
				{product.category && <p className="truncate">{product.category}</p>}

				<p className="text-primary-forest-green font-medium text-lg truncate w-full">
					{product.brand?.toLowerCase() || "Brand"}
				</p>

				<p className="text-primary-forest-green font-medium text-lg truncate w-full">
					{product.description?.toLowerCase() || "Description"}
				</p>

				<div className="flex items-end justify-between mt-3">
					<p className="md:text-xl text-base font-medium text-primary-forest-green">
						{currency}
						{offerPrice.toFixed(2)}
						{offerPrice !== regularPrice && (
							<span className="text-primary-forest-green/60 md:text-sm text-xs line-through ml-1">
								{currency}
								{regularPrice.toFixed(2)}
							</span>
						)}
					</p>

					<div
						onClick={(event) => event.stopPropagation()}
						className="text-primary-sage-green"
					>
						{!cartItems[product._id || product.upc] ? (
							<button
								className="flex items-center justify-center gap-1 border border-primary-forest-green/70 md:w-[80px] w-[64px] h-[34px] rounded text-primary-forest-green cursor-pointer bg-primary-cream/50"
								onClick={() =>
									addToCart(product._id || product.upc)
								}
							>
								<img src={assets.cart} alt="cart icon" />
								add
							</button>
						) : (
							<div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] rounded select-none bg-primary-cream/50">
								<button
									onClick={() =>
										removeFromCart(
											product._id || product.upc,
										)
									}
									className="cursor-pointer text-md px-2 h-full text-primary-forest-green"
								>
									-
								</button>
								<span className="w-5 text-center text-primary-forest-green">
									{cartItems[product._id || product.upc]}
								</span>
								<button
									onClick={() =>
										addToCart(product._id || product.upc)
									}
									className="cursor-pointer text-md px-2 h-full text-primary-forest-green"
								>
									+
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProductCard;
