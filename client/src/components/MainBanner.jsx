import React from "react";
import bannerBg from "../assets/mainBannerBg.png";
import bannerBgSmall from "../assets/mainBannerBgSmall.png";
import rightArrowBeige from "../assets/rightArrowBeige.svg";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const MainBanner = () => {
	const { navigate, products } = useAppContext();

	return (
		<div className="relative">
			<img
				src={bannerBg}
				alt="banner"
				className="w-full hidden md:block bg-gradient-to-r from-[#2d5b3e] to-[#8cae8c]"
			/>
			<img
				src={bannerBgSmall}
				alt="banner"
				className="w-full md:hidden bg-gradient-to-b from-[#2d5b3e] to-[#8cae8c]"
			/>
			<div className="absolute inset-0 flex flex-col items-center md:items-start justify-end md:justify-center pb-24 md:pb-0 px-4 md:pl-18 lg:pl-24">
				<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center md:text-left max-w-72 md:max-w-80 lg:max-w-105 leading-tight lg:leading-15 text-[#daa520] ">
					Nourish with Purpose — Your Food Is Your Medicine.
				</h1>

				<div className="flex items-center mt-6 font-medium">
					<Link
						to={"/products"}
						className="group flex items-center gap-2 px-7 md:px-9 py-3 bg-primary hover:bg-primary-dull transition rounded text-[#daa520] cursor-pointer "
					>
						Shop now
						<img
							className="md:hidden transition group-focus:translate-x-1 sm:color-[#8b4513]"
							src={rightArrowBeige}
							alt="arrow"
						/>
					</Link>
					<Link
						to={"/products"}
						className="group hidden md:flex items-center gap-2 px-9 py-3 cursor-pointer text-[#daa520]"
					>
						See Top Sellers
						<img
							className="transition group-hover:translate-x-1"
							src={rightArrowBeige}
							alt="arrow"
						/>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default MainBanner;
