import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import { fetchAndSaveKrogerProducts } from "../utils/krogerProducts.js";

dotenv.config();
const krogerRouter = express.Router();

const KROGER_API_URL =
	process.env.KROGER_API_URL || "https://api.kroger.com/v1";
const DEFAULT_LOCATION_ID = process.env.KROGER_LOCATION_ID || "01400943";

let accessToken = null;
let tokenExpiration = null;

const getKrogerAccessToken = async () => {
	if (accessToken && tokenExpiration > Date.now()) {
		return accessToken;
	}

	const credentials = Buffer.from(
		`${process.env.KROGER_CLIENT_ID}:${process.env.KROGER_CLIENT_SECRET}`,
	).toString("base64");

	const response = await axios.post(
		`${KROGER_API_URL}/connect/oauth2/token`,
		"grant_type=client_credentials&scope=product.compact",
		{
			headers: {
				Authorization: `Basic ${credentials}`,
				"Content-Type": "application/x-www-form-urlencoded",
			},
		},
	);

	accessToken = response.data.access_token;
	tokenExpiration = Date.now() + (response.data.expires_in - 300) * 1000;
	return accessToken;
};

const transformKrogerProduct = (product) => {
	const regularPrice = product.price?.regular || 0;
	const salePrice = product.price?.promo || product.price?.regular || 0;

	const imageUrl =
		product.images?.find((image) => image.size === "large")?.url ||
		product.images?.[0]?.url ||
		"https://via.placeholder.com/300?text=No+Image";

	const category = Array.isArray(product.categories)
		? product.categories[0] || "General"
		: product.categories || "General";

	const subCategory = Array.isArray(product.categories)
		? product.categories[1] || ""
		: "";

	const productName = product.name || "Unknown Product";

	return {
		productId: product.productId || "",
		name: productName,
		brand: product.brand || "Generic",
		description: product.description || "",
		regularPrice: regularPrice,
		offerPrice: salePrice,
		price: {
			regular: regularPrice,
			sale: salePrice,
		},
		image: [imageUrl],
		category: category,
		subCategory: subCategory,
		size: product.size || "",
		upc: product.upc || "",
		source: "kroger",
	};
};

const fetchKrogerProducts = async (term, limit = 50) => {
	if (!term?.trim()) return [];
	try {
		const token = await getKrogerAccessToken();

		const numericLimit = Number(limit) || 50;

		const response = await axios.get(`${KROGER_API_URL}/products`, {
			params: {
				"filter.term": term.trim(),
				"filter.locationId": DEFAULT_LOCATION_ID,
				"filter.limit": numericLimit,
			},
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		return response.data?.data || [];
	} catch (error) {
		console.error(
			"Kroger API error:",
			error.response?.data || error.message,
		);
		return [];
	}
};

krogerRouter.get("/search", async (request, response) => {
	try {
		const { query = "healthy", limit = 50 } = request.query;
		const trimmedQuery = query.trim();
		if (!trimmedQuery) {
			return response
				.status(400)
				.json({ success: false, message: "Query required" });
		}

		const products = await fetchAndSaveKrogerProducts(
			trimmedQuery,
			DEFAULT_LOCATION_ID,
			Number(limit),
		);
		console.log(`Returning ${products.length} products to frontend`);

		response.json({
			success: true,
			products: products,
			total: products.length,
		});
		console.log("Search query:", trimmedQuery);
	} catch (error) {
		console.error("Search error:", error.message);
		response.json({
			success: false,
			message: error.message,
		});
	}
});

krogerRouter.get("/category/:category", async (request, response) => {
	try {
		const { category } = request.params;
		const { limit = 50 } = request.query;
		console.log("Category query:", category);

		const products = await fetchAndSaveKrogerProducts(
			category,
			DEFAULT_LOCATION_ID,
			Number(limit),
		);

		response.json({
			success: true,
			products: products,
			total: products.length,
		});
	} catch (error) {
		console.error("Category error:", error.message);
		response.json({
			success: false,
			message: error.message,
		});
	}
});

krogerRouter.get("/featured", async (_request, response) => {
	try {
		const products = await fetchAndSaveKrogerProducts(
			"milk",
			DEFAULT_LOCATION_ID,
			20,
		);
		response.json({
			success: true,
			products: products,
			total: products.length,
		});
	} catch (error) {
		console.error("Featured error:", error.message);
		response.json({
			success: false,
			message: error.message,
		});
	}
});

krogerRouter.get("/categories", (_request, response) => {
	response.json({
		success: true,
		categories: [
			"Dairy",
			"Bakery",
			"Meat",
			"Produce",
			"Beverages",
			"Snacks",
			"Frozen",
			"Pantry",
			"Health & Beauty",
			"Fruit & Vegetables",
			"Meat",
			"Seafood",
			"Deli",
			"Bakery",
			"Floral",
			"Baby",
		],
	});
});

export default krogerRouter;
