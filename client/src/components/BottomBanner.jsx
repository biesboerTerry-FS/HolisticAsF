import React from "react";
import { assets } from "../assets/assets";

const BottomBanner = () => {
	const features = [
		{
			icon: assets.deliveryTruck,
			title: "farm-to-table freshness",
			description:
				"nourishing whole foods delivered with care and intention.",
		},
		{
			icon: assets.leaf,
			title: "mindfully sourced",
			description:
				"organic, sustainable ingredients chosen for your wellness journey",
		},
		{
			icon: assets.coinIcon,
			title: "wholesome & accessible",
			description: "premium quality nutrition that honors your budget.",
		},
		{
			icon: assets.trust,
			title: "community trusted",
			description:
				"empowering 10,000+ families on their path to holistic health.",
		},
	];

	return (
		<div className="relative mt-24 rounded-3xl overflow-hidden border border-primary-forest-green/30 shadow-lg bg-gradient-to-b from-[#172033] to-[#9AA8BD]">
			<img
				src={assets.bottomBanner}
				alt="banner"
				className="absolute inset-0 w-full h-full hidden lg:block object-cover object-right"
			/>

			<img
				src={assets.bottomBannerSmall}
				alt="banner"
				className="absolute inset-0 w-full h-full hidden md:block lg:hidden object-cover object-bottom"
			/>

			<div className="absolute inset-0 hidden md:block bg-gradient-to-r from-[#172033] via-[#172033]/70 to-transparent" />

			<div className="relative px-4 md:px-8 lg:px-16 py-10 md:py-16 lg:py-20">
				<div className="flex flex-col gap-3 sm:gap-4 md:gap-6 lg:gap-8 w-full md:max-w-[40%]">
					{features.map((feature, index) => (
						<div
							key={index}
							className="flex items-start gap-2 sm:gap-3 md:gap-4"
						>
							<img
								src={feature.icon}
								alt={feature.title}
								className="w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 flex-shrink-0 mt-0.5 rounded-xl"
							/>

							<div className="flex flex-col">
								<h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-secondary-golden-honey mb-0.5 md:mb-1">
									{feature.title}
								</h3>
								<p className="text-xs sm:text-sm md:text-base lg:text-lg text-[#ffffff] leading-snug">
									{feature.description}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default BottomBanner;
