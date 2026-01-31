import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
// import { assets } from "../assets/assets";

const ProductSearch = () => {
	const { searchProducts, loading } = useAppContext();
	const [searchQuery, setSearchQuery] = useState("");
	const [isSearching, setIsSearching] = useState(false);

	const handleSearch = async (event) => {
		event.preventDefault();

		if (!searchQuery.trim()) {
			toast.error("Please enter a search term");
			return;
		}

		setIsSearching(true);

		try {
			console.log(`Searching for: ${searchQuery}`);
			await searchProducts(searchQuery);
		} catch (error) {
			console.error("Search error:", error);
			toast.error(error.message || "Search failed. Please try again.");
		} finally {
			setIsSearching(false);
		}
	};

	const suggestions = [
		"milk",
		"bread",
		"eggs",
		"cheese",
		"chicken",
		"apple",
		"orange",
		"coffee",
		"tea",
	];

	const handleSuggestionClick = async (suggestion) => {
		setSearchQuery(suggestion);
		setIsSearching(true);

		try {
			await searchProducts(suggestion);
		} catch (error) {
			toast.error("Search failed");
		} finally {
			setIsSearching(false);
		}
	};

	return (
		<div className="w-full bg-primary-sage-green/20 py-8 px-4">
			<div className="max-w-2xl mx-auto">
				<form onSubmit={handleSearch} className="flex gap-2 mb-6">
					<input
						type="text"
						placeholder="Search products (e.g., 'milk', 'bread', 'eggs')..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						disabled={isSearching || loading}
						className="flex-1 px-4 py-3 border-2 border-primary-forest-green rounded outline-none focus:border-secondary-golden-honey transition bg-white text-primary-forest-green placeholder-gray-500 disabled:opacity-50"
					/>
					<button
						type="submit"
						disabled={isSearching || loading}
						className="px-8 py-3 bg-primary-forest-green text-white rounded font-medium hover:bg-primary-forest-green-dull transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
					>
						{isSearching || loading ? (
							<>
								<span className="inline-block animate-spin">
									⟳
								</span>
								Searching...
							</>
						) : (
							"Search"
						)}
					</button>
				</form>

				<div className="flex flex-wrap gap-2 justify-center">
					<span className="text-sm text-primary-forest-green/70 w-full text-center mb-2">
						Try searching:
					</span>
					{suggestions.map((suggestion) => (
						<button
							key={suggestion}
							onClick={() => handleSuggestionClick(suggestion)}
							disabled={isSearching || loading}
							className="px-4 py-2 bg-white border border-primary-forest-green text-primary-forest-green rounded hover:bg-primary-forest-green hover:text-white transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{suggestion}
						</button>
					))}
				</div>
			</div>
		</div>
	);
};

export default ProductSearch;
