import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import cartIcon from "../assets/cart.svg";
import starFull from "../assets/starFull.svg";
import starEmpty from "../assets/starEmpty.svg";
import fileUpload from "../assets/fileUpload.svg";
import { dummyProducts } from "../assets/assets";

const ProductCard = ({ product }) => {
	const [count, setCount] = useState(0);
	const { currency, addToCart, removeFromCart, cartItems, navigate } =
		useAppContext();

	return (
		<div className="border border-gray-500/20 rounded-md md:px-4 px-3 py-2 bg-white min-w-56 max-w-56 w-full">
			<div className="group cursor-pointer flex items-center justify-center px-2">
				<img className="group-hover:scale-105 transition max-w-26 md:max-w-36" />
			</div>
			<div className="text-gray-500/60 text-sm">
				<p className="text-gray-700 font-medium text-lg truncate w-full"></p>
				<div className="flex items-center gap-0.5">
					<img className="md:w-3.5 w-3" alt="" />

					<p>(4)</p>
				</div>
				<div className="flex items-end justify-between mt-3">
					<p className="md:text-xl text-base font-medium text-primary">
						<span className="text-gray-500/60 md:text-sm text-xs line-through"></span>
					</p>
					<div className="text-primary">
						<button className="flex items-center justify-center gap-1 bg-primary/10 border border-primary/40 md:w-[80px] w-[64px] h-[34px] rounded cursor-pointer">
							<img src={cartIcon} alt="cart_icon" />
							Add
						</button>

						<div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-primary/25 rounded select-none">
							<button className="cursor-pointer text-md px-2 h-full">
								-
							</button>
							<span className="w-5 text-center"></span>
							<button className="cursor-pointer text-md px-2 h-full">
								+
							</button>
						</div>
						{/* )} */}
					</div>
				</div>
			</div>
		</div>
	);
	// );
};

export default ProductCard;
