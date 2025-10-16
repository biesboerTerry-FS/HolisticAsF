const Newsletter = () => {
	return (
		<div className="flex flex-col items-center justify-center text-center space-y-2 mt-24 pb-14">
			<h1 className="md:text-4xl text-2xl font-semibold text-[#2d5b3e]">
				Never Miss a Deal!
			</h1>
			<p className="md:text-lg text-gray-500/70 pb-8">
				Subscribe to get the latest offers, new arrivals, and exclusive
				discounts
			</p>
			<form className="flex items-center justify-between max-w-2xl w-full md:h-13 h-12">
				<input
					className="border border-[#1b3b28] bg-[#fefefe] text-[#8b4513] rounded-md h-full outline-none w-full rounded-r-none px-3"
					type="text"
					placeholder="Enter your email"
					required
				/>
				<button
					type="submit"
					className="md:px-12 px-8 h-full bg-[#8cae8c] hover:bg-[#2d5b3e] text-[#fefefe] transition-all cursor-pointer rounded-md rounded-l-none"
				>
					Subscribe
				</button>
			</form>
		</div>
	);
};

export default Newsletter;
