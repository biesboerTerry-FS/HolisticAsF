import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
// import { useAppContext } from "../context/AppContext";

const MainBanner = () => {
	// const { navigate, products } = useAppContext();

	return (
		<div className="relative rounded-3xl overflow-hidden border border-primary-forest-green/30 shadow-lg">
			<img
				src={assets.mainBannerBg}
				alt="banner"
				className="w-full h-auto hidden md:block bg-gradient-to-r from-[#172033] to-[#9AA8BD]"
			/>
			<img
				src={assets.mainBannerBgSmall}
				alt="banner"
				className="w-full h-auto md:hidden bg-gradient-to-t from-[#172033] to-[#9AA8BD] "
			/>

			<div className="absolute inset-0 flex flex-col items-center md:items-start justify-end md:justify-center pb-24 md:pb-0 px-4 md:pl-18 lg:pl-24">
				<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center md:text-left max-w-72 md:max-w-80 lg:max-w-105 leading-tight lg:leading-15 text-secondary-golden-honey italic">
					nourish with purpose - your food is your medicine.
				</h1>

				<div className="flex items-center mt-6 font-medium">
					<Link
						to={"/products"}
						className="group flex items-center gap-2 px-7 md:px-9 py-3 bg-secondary-golden-honey hover:opacity-90 transition rounded text-white dark:text-[#111827] cursor-pointer "
					>
						shop now
						<img
							className="md:hidden transition group-focus:translate-x-1"
							src={assets.rightArrowBeige}
							alt="arrow"
						/>
					</Link>
					<Link
						to={"/top-sellers"}
						className="group hidden md:flex items-center gap-2 px-9 py-3 cursor-pointer text-secondary-golden-honey hover:text-primary-cream"
					>
						see top sellers
						<img
							className="transition group-hover:translate-x-1"
							src={assets.rightArrowBeige}
							alt="arrow"
						/>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default MainBanner;
