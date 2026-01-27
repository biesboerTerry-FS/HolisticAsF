import React from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const ProductCard = ({ product }) => {
	const { currency, addToCart, removeFromCart, cartItems, navigate } =
		useAppContext();

	const onClickHandler = () => {
		if (product?.category && product?._id) {
			navigate(`/products/${product.category}/${product._id}`);
		}
	};

	return (
		product && (
			<div
				onClick={() => {
					navigate(`/products/${product.category}/${product._id}`);
					scrollTo(0, 0);
				}}
				className="border border-primary-forest-green bg-primary-sage-green/40 rounded-md md:px-4 px-3 py-2 min-w-28 max-w-52 w-full"
			>
				<div className="group cursor-pointer flex items-center justify-center px-2">
					<img
						className="group-hover:scale-105 transition max-w-26 md:max-w-36"
						src={product.image[0]}
						alt={product.name}
					/>
				</div>

				<div className="text-primary-forest-green/60 text-sm">
					<p>{product.category}</p>
					<p className="text-primary-forest-green font-medium text-lg truncate w-full">
						{product.name}
					</p>
					<div className="flex items-center gap-0.5">
						{Array(5)
							.fill("")
							.map((_, i) => (
								<img
									key={i}
									className="md:w-3.5 w-3"
									src={
										i < 4
											? assets.star_icon
											: assets.star_dull_icon
									}
									alt=""
								/>
							))}
						<p>(4)</p>
					</div>

					<div className="flex items-end justify-between mt-3">
						<p className="md:text-xl text-base font-medium text-primary-forest-green">
							{currency}
							{product.offerPrice}{" "}
							<span className="text-primary-forest-green/60  md:text-sm text-xs line-through">
								{currency}
								{product.price}
							</span>
						</p>

						<div
							onClick={(e) => {
								e.stopPropagation();
							}}
							className="text-primary-sage-green"
						>
							{!cartItems[product._id] ? (
								<button
									className="flex items-center justify-center gap-1  border border-primary-forest-green/70 md:w-[80px] w-[64px] h-[34px] rounded text-primary-forest-green cursor-pointer bg-primary-cream/50"
									onClick={() => addToCart(product._id)}
								>
									<img src={assets.cart} alt="cart icon" />
									add
								</button>
							) : (
								<div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] ] rounded select-none bg-primary-cream/50">
									<button
										onClick={() => {
											removeFromCart(product._id);
										}}
										className="cursor-pointer text-md px-2 h-full text-primary-forest-green"
									>
										-
									</button>
									<span className="w-5 text-center text-primary-forest-green">
										{cartItems[product._id]}
									</span>
									<button
										onClick={() => {
											addToCart(product._id);
										}}
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
		)
	);
};

export default ProductCard;
