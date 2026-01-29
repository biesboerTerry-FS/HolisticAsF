import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import ProductSearch from "../components/ProductSearch";
import ProductCard from "../components/ProductCard";
import toast from "react-hot-toast";

const Products = () => {
	const { products, loading, addToCart, navigate } = useAppContext();
	const [displayedProducts, setDisplayedProducts] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [categories, setCategories] = useState([]);
	const [isLoadingCategories, setIsLoadingCategories] = useState(false);

	// Get unique categories from products
	useEffect(() => {
		if (products && products.length > 0) {
			const uniqueCategories = [
				...new Set(
					products.map(
						(product) =>
							product.category ||
							product.categories?.[0] ||
							"Other",
					),
				),
			].sort();

			setCategories(uniqueCategories);
			setDisplayedProducts(products);
		}
	}, [products]);

	// Filter products by category
	const handleCategoryChange = (category) => {
		setSelectedCategory(category);

		if (category === "all") {
			setDisplayedProducts(products);
		} else {
			const filtered = products.filter(
				(product) =>
					product.category === category ||
					product.categories?.includes(category),
			);
			setDisplayedProducts(filtered);

			if (filtered.length === 0) {
				toast.info(`No products found in ${category}`);
			}
		}
	};

	// Handle add to cart
	const handleAddToCart = (productId) => {
		addToCart(productId);
	};

	// Get unique product ID (Kroger or MongoDB)
	const getProductId = (product) => {
		return product._id || product.productId || product.id;
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<div className="text-center">
					<div className="inline-block animate-spin text-4xl mb-4">
						⟳
					</div>
					<p className="text-primary-forest-green text-lg">
						Loading products from Kroger...
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-white">
			{/* Search Bar */}
			<ProductSearch />

			{/* Main Content */}
			<div className="max-w-7xl mx-auto px-4 py-12">
				{/* Category Filter */}
				{categories.length > 0 && (
					<div className="mb-8">
						<h3 className="text-lg font-semibold text-primary-forest-green mb-4">
							Categories
						</h3>
						<div className="flex flex-wrap gap-2">
							<button
								onClick={() => handleCategoryChange("all")}
								className={`px-4 py-2 rounded transition ${
									selectedCategory === "all"
										? "bg-primary-forest-green text-white"
										: "bg-gray-200 text-primary-forest-green hover:bg-gray-300"
								}`}
							>
								All Products
							</button>

							{categories.map((category) => (
								<button
									key={category}
									onClick={() =>
										handleCategoryChange(category)
									}
									className={`px-4 py-2 rounded transition ${
										selectedCategory === category
											? "bg-primary-forest-green text-white"
											: "bg-gray-200 text-primary-forest-green hover:bg-gray-300"
									}`}
								>
									{category}
								</button>
							))}
						</div>
					</div>
				)}

				{/* Products Grid */}
				{displayedProducts.length === 0 ? (
					<div className="text-center py-12">
						<div className="text-6xl mb-4">🛒</div>
						<p className="text-xl text-gray-600 mb-4">
							No products found
						</p>
						<p className="text-gray-500 mb-6">
							Try searching for something different
						</p>
						<button
							onClick={() => {
								setSelectedCategory("all");
								setDisplayedProducts(products);
							}}
							className="px-6 py-2 bg-primary-forest-green text-white rounded hover:bg-primary-forest-green-dull transition"
						>
							View All Products
						</button>
					</div>
				) : (
					<>
						{/* Results Count */}
						<div className="mb-6 text-gray-600">
							<p>
								Showing{" "}
								<span className="font-semibold">
									{displayedProducts.length}
								</span>{" "}
								products
								{selectedCategory !== "all" &&
									` in ${selectedCategory}`}
							</p>
						</div>

						{/* Products Grid */}
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
							{displayedProducts.map((product) => (
								<div key={getProductId(product)}>
									<ProductCard
										product={product}
										onAddToCart={() =>
											handleAddToCart(
												getProductId(product),
											)
										}
									/>
								</div>
							))}
						</div>
					</>
				)}

				{/* Info Section */}
				<div className="mt-16 text-center bg-primary-sage-green/20 rounded-lg p-8">
					<h3 className="text-xl font-semibold text-primary-forest-green mb-2">
						Real-time Kroger Products
					</h3>
					<p className="text-gray-600">
						All products displayed are sourced directly from
						Kroger's current inventory. Prices and availability are
						updated in real-time.
					</p>
				</div>
			</div>
		</div>
	);
};

export default Products;
