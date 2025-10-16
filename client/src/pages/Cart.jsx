import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import rightArrow from "../assets/rightArrow.svg";
import remove from "../assets/removeIcon.svg";
import { assets } from "../assets/assets";

const Cart = () => {
	return (
		<div className="flex flex-col md:flex-row mt-16">
			<div className="flex-1 max-w-4xl">
				<h1 className="text-3xl font-medium mb-6 text-[#2d5b3e]">
					Shopping{" "}
					<span className="text-3xl font-medium mb-6 text-[#daa520]">
						Cart{" "}
					</span>
					<span className="text-sm text-[#8cae8c]">3 Items</span>
				</h1>

				<div className="grid grid-cols-[2fr_1fr_1fr] text-[#2d5b3e] text-base font-medium pb-3">
					<p className="text-left">Product Details</p>
					<p className="text-center">Subtotal</p>
					<p className="text-center">Action</p>
				</div>

				<div className="grid grid-cols-[2fr_1fr_1fr] text-[#2d5b3e] items-center text-sm md:text-base font-medium pt-3">
					<div className="flex items-center md:gap-6 gap-3">
						<div className="cursor-pointer w-24 h-24 flex items-center justify-center border border-[#2d5b3e] rounded">
							<img
								className="max-w-full h-full object-cover"
								src=""
								alt=""
							/>
						</div>
						<div>
							<p className="hidden md:block font-semibold"></p>
							<div className="flex items-center">
								<p>Quantity:</p>
								<select className="outline-none" name="" id="">
									<option value=""></option>
								</select>
							</div>
						</div>
					</div>
				</div>
				<p className="text-center"></p>
				<button className="cursor-pointer mx-auto">
					<img src={assets.remove} alt="" />
				</button>
			</div>

			<button>
				<img src={assets.rightArrowGreen} alt="" />
				Continue Shopping
			</button>
		</div>
		
	);
};

export default Cart;
