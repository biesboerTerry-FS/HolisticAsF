import axios from "axios";
import KrogerProduct from "../models/KrogerProduct.js";
import { getKrogerAccessToken } from "./krogerAuth.js";

const PLACEHOLDER_IMAGE = "https://via.placeholder.com/300x300?text=No+Image";

export const fetchAndSaveKrogerProducts = async (
	term = "healthy",
	locationId = "01400943",
	limit = 50,
) => {
	try {
		const token = await getKrogerAccessToken();

		console.log("Fetching Kroger products...", {
			term,
			locationId,
			limit,
		});

		const response = await axios.get("https://api.kroger.com/v1/products", {
			params: {
				"filter.term": term,
				"filter.locationId": locationId,
				"filter.limit": limit,
			},
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${token}`,
			},
		});

		console.log("Raw Kroger API Response:", response.data);

		const krogerItems = response.data.data || response.data || [];

		if (!Array.isArray(krogerItems) || krogerItems.length === 0) {
			console.warn("No products found in Kroger response");
			return [];
		}

		console.log(`Processing ${krogerItems.length} items from Kroger API`);

		const krogerProducts = krogerItems.map((item) => {
			const regularPrice = item.items?.[0]?.price?.regular || 0;
			const salePrice = item.items?.[0]?.price?.sale || regularPrice;

			const imageUrls =
				item.images && Array.isArray(item.images)
					? item.images.map((img) => img.url).filter(Boolean)
					: [PLACEHOLDER_IMAGE];

			const product = {
				name: item.name || "Unknown Product",
				description:
					item.description ||
					item.brand ||
					"No description available",
				brand: item.brand || "Unknown",
				regularPrice: regularPrice,
				offerPrice: salePrice,
				price: {
					regular: regularPrice,
					sale: salePrice,
				},
				image: imageUrls,
				category: item.categories?.[0]?.name || term || "Uncategorized",
				subCategory: item.categories?.[1]?.name || "",
				upc: item.upc || item.productId,
				productId: item.productId || item.upc,
				externalId: item.upc || item.productId,
				source: "kroger",
				isKrogerProduct: true,
				stock: item.inStock ? 100 : 0,
				size: item.size || "",
				krogerProductId: item.productId,
				krogerUpc: item.upc,
			};

			console.log("Mapped product:", {
				name: product.name,
				regularPrice: product.regularPrice,
				offerPrice: product.offerPrice,
				image: product.image[0],
				upc: product.upc,
			});

			return product;
		});

		console.log(`Saving ${krogerProducts.length} products to MongoDB...`);

		let savedCount = 0;
		for (const product of krogerProducts) {
			try {
				const result = await KrogerProduct.updateOne(
					{ upc: product.upc },
					{ $set: product },
					{ upsert: true },
				);
				if (result.upsertedId || result.modifiedCount > 0) {
					savedCount++;
				}
			} catch (error) {
				console.error(
					`Error saving product ${product.upc}:`,
					error.message,
				);
			}
		}

		console.log(`Successfully saved ${savedCount} products to MongoDB`);
		return krogerProducts;
	} catch (error) {
		console.error(
			"Error fetching Kroger products:",
			error.response?.data || error.message,
		);
		return [];
	}
};

export const validateKrogerProduct = (product) => {
	const issues = [];

	if (!product.name || product.name === "Unknown Product") {
		issues.push("Missing or placeholder product name");
	}

	if (!product.regularPrice || product.regularPrice === 0) {
		issues.push("Missing or zero regular price");
	}

	if (!product.image || product.image[0] === PLACEHOLDER_IMAGE) {
		issues.push("Missing or placeholder image");
	}

	if (!product.upc) {
		issues.push("Missing UPC identifier");
	}

	return {
		isValid: issues.length === 0,
		issues,
	};
};
