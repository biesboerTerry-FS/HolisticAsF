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
		<div className="relative mt-24">
			<img
				src={assets.bottomBanner}
				alt="banner"
				className="w-full max-h-140 hidden lg:block object-cover object-right bg-gradient-to-r from-primary-forest-green to-primary-sage-green"
			/>

			<img
				src={assets.bottomBannerSmall}
				alt="banner"
				className="w-full hidden md:block lg:hidden object-cover object-bottom bg-gradient-to-b from-primary-forest-green to-primary-sage-green"
			/>

			<div className="md:absolute md:inset-0 md:flex md:items-end lg:items-center md:justify-start bg-gradient-to-b from-primary-forest-green to-primary-sage-green md:bg-none px-4 md:px-8 lg:px-16 py-8 md:pb-8 lg:pb-0">
				<div className="flex flex-col gap-3 sm:gap-4 md:gap-6 lg:gap-8 w-full md:max-w-[40%]">
					{features.map((feature, index) => (
						<div
							key={index}
							className="flex items-start gap-2 sm:gap-3 md:gap-4"
						>
							<img
								src={feature.icon}
								alt={feature.title}
								className="w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 flex-shrink-0 mt-0.5"
							/>

							<div className="flex flex-col">
								<h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-secondary-golden-honey mb-0.5 md:mb-1">
									{feature.title}
								</h3>
								<p className="text-xs sm:text-sm md:text-base lg:text-lg text-secondary-soft-beige leading-snug">
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
