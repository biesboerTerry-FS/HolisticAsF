import React from "react";
import { assets } from "../assets/assets";
import deliveryTruck from "../assets/deliveryTruck.svg";
import leaf from "../assets/leaf.svg";
import coin from "../assets/coin.svg";
import trust from "../assets/trust.svg";

const BottomBanner = () => {
	const features = [
		{
			icon: deliveryTruck,
			title: "Farm-to-Table Freshness",
			description:
				"Nourishing whole foods delivered with care and intention.",
		},
		{
			icon: leaf,
			title: "Mindfully Sourced",
			description:
				"Organic, sustainable ingredients chosen for your wellness journey.",
		},
		{
			icon: coin,
			title: "Wholesome & Accessible",
			description: "Premium quality nutrition that honors your budget.",
		},
		{
			icon: trust,
			title: "Community Trusted",
			description:
				"Empowering 10,000+ families on their path to holistic health.",
		},
	];

	return (
		<div className="relative mt-24">
			<img
				src={assets.bottomBanner}
				alt="banner"
				className="w-full max-h-140 hidden md:block object-cover object-right bg-gradient-to-r from-[#2d5b3e] to-[#8cae8c]"
			/>

			<img
				src={assets.bottomBannerSmall}
				alt="banner"
				className="w-full md:hidden object-cover object-bottom  bg-gradient-to-b from-[#2d5b3e] to-[#8cae8c]"
			/>

			<div className="absolute inset-0 flex items-end md:items-center justify-start px-4 md:px-8 lg:px-16 pb-8 md:pb-0">
				<div className="flex flex-col gap-4 md:gap-8 w-full md:max-w-[40%]">
					{features.map((feature, index) => (
						<div key={index} className="flex items-start gap-4">
							<img
								src={feature.icon}
								alt={feature.title}
								className="w-12 h-12 md:w-16 md:h-16 flex-shrink-0"
							/>

							<div className="flex flex-col">
								<h1 className="text-lg md:text-xl lg:text-2xl font-bold text-[#daa520] mb-1">
									{feature.title}
								</h1>
								<h3 className="text-sm md:text-base lg:text-lg text-[#f5f5dc]">
									{feature.description}
								</h3>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default BottomBanner;
