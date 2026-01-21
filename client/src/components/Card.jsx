import React from "react";
import food from "../assets/food.jpg";

const Card = ({ title, subtitle, header, subhead, description, image }) => {
	return (
		<div className="inline-flex items-start">
			<div className="flex items-start rounded-xl h-[400px] w-[270px] relative shadow-[0_25px_50px_-12px_rgba(0,0,0,0.35)]">
				<div className="bg-primary-sage-green h-full w-full absolute left-0 top-0 z-0 rounded-xl" />

				<div className="flex flex-col items-start flex-1 flex-grow rounded-xl overflow-hidden relative z-[1]">
					<div className="flex items-center justify-between self-stretch h-[72px] w-full py-3 pr-1 pl-4 relative">
						<div className="inline-flex items-center flex-[0_0_auto] gap-4 relative">
							<div className="w-10 h-10 rounded-full bg-secondary-soft-beige flex items-center justify-center">
								<span className="text-secondary-golden-honey font-medium text-lg">
									hAf
								</span>
							</div>

							<div className="flex flex-col items-start gap-1 w-[236px] relative">
								<div className="self-stretch text-secondary-soft-beige font-medium text-base leading-6 -mt-px relative">
									{header}
								</div>
								<div className="self-stretch text-secondary-soft-beige text-sm leading-5 relative">
									{subhead}
								</div>
							</div>
						</div>

						<button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition">
							⋮
						</button>
					</div>

					<div className="self-stretch bg-secondary-soft-beige h-[160px] w-full justify-between relative">
						<img
							className="h-full w-full absolute left-0 top-0 object-cover"
							alt={title}
							src={food}
						/>
					</div>

					<div className="flex flex-col items-start self-stretch flex-[0_0_auto] gap-8 p-4 w-full relative">
						<div className="flex flex-col items-start self-stretch flex-[0_0_auto] w-full relative">
							<div className="text-secondary-soft-beige text-base leading-6 -mt-px w-full relative">
								{title}
							</div>
							<div className="text-secondary-soft-beige text-sm leading-5 w-full relative">
								{subtitle}
							</div>
						</div>

						<p className="self-stretch text-secondary-soft-beige text-sm leading-5 relative">
							{description}
						</p>

						<div className="flex items-center self-stretch gap-2 h-10 justify-around w-full relative">
							<button className="px-6 py-2 rounded-full border border-secondary-deep-forest bg-primary-cream text-primary-forest-green text-sm font-medium hover:bg-primary-forest-green hover:text-secondary-soft-beige transition cursor-pointer">
								More info
							</button>

							<button className="px-6 py-2 rounded-full bg-secondary-golden-honey border border-secondary-earthy-brown hover:bg-secondary-earthy-brown text-white text-sm font-medium hover:bg-opacity-90 transition  cursor-pointer">
								Add to Cart
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Card;
