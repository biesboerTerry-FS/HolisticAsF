import React from "react";
import logo from "../assets/holisticAfLogo.png";
import { footerLinks } from "../assets/assets";

const Footer = () => {
	return (
		<div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-24 bg-gradient-to-b from-[#f5f5dc] to-[#8cae8c] to-[#2d5b3e] ">
			<div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-[#1b3b28] text-[#1b3b28] font-semibold">
				<div>
					{/* <img className="w-34 md:w-32" src={logo} alt="logo" /> */}
					<h1 className="text-6xl text-[#daa520] font-bold">
						holisticAf
					</h1>
					<p className="max-w-[410px] mt-6">
						Nourishing bodies, uplifting spirits, and honoring the
						earth—one mindful bite at a time. We source the finest
						whole foods to fuel your wellness journey and celebrate
						the transformative power of eating with intention.
					</p>
				</div>
				<div className="flex flex-wrap justify-between w-full md:w-[45%] gap-5">
					{footerLinks.map((section, index) => (
						<div key={index}>
							<h3 className="font-semibold text-xl text-[#daa520] md:mb-5 mb-2">
								{section.title}
							</h3>
							<ul className="text-sm space-y-1 text-[#1b3b28]">
								{section.links.map((link, i) => (
									<li key={i}>
										<a
											href={link.url}
											className="hover:font-bold hover:text-[#daa520] transition"
										>
											{link.text}
										</a>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
			</div>
			<p className="py-4 text-center text-sm md:text-base text-[#1b3b28] hover:font-bold  hover:text-lg hover:text-[#8b4513] transition">
				copyright {new Date().getFullYear()} © holisticAF.com | all
				rights reserved | one love
			</p>
		</div>
	);
};

export default Footer;
