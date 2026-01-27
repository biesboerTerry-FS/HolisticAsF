import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const KROGER_CLIENT_ID = process.env.KROGER_CLIENT_ID;
const KROGER_CLIENT_SECRET = process.env.KROGER_CLIENT_SECRET;
const KROGER_API_URL = process.env.KROGER_API_URL;

let accessToken = null;
let tokenExpiration = null;

// ^ Get OAuth Token from Kroger
export const getKrogerAccessToken = async () => {
	try {
		// Check if token is still valid
		if (accessToken && tokenExpiration > Date.now()) {
			console.log("Using cached Kroger token");
			return accessToken;
		}

		console.log("🔄 Fetching new Kroger access token...");

		// Encode credentials for Basic Auth
		const credentials = Buffer.from(
			`${KROGER_CLIENT_ID}:${KROGER_CLIENT_SECRET}`,
		).toString("base64");

		const response = await axios.post(
			`${KROGER_API_URL}/oauth/token`,
			"grant_type=client_credentials&scope=product.compact",
			{
				headers: {
					Authorization: `Basic ${credentials}`,
					"Content-Type": "application/x-www-form-urlencoded",
				},
			},
		);

		accessToken = response.data.access_token;
		// Set expiration 5 minutes before actual expiry for safety
		tokenExpiration = Date.now() + (response.data.expires_in - 300) * 1000;

		console.log("✅ New Kroger token obtained");
		return accessToken;
	} catch (error) {
		console.error("Error getting Kroger token:", error.message);
		throw new Error("Failed to authenticate with Kroger API");
	}
};

// ^ Search Products from Kroger
export const searchKrogerProducts = async (query, limit = 20) => {
	try {
		const token = await getKrogerAccessToken();

		const response = await axios.get(`${KROGER_API_URL}/products`, {
			params: {
				query: query,
				limit: limit,
				filter: {
					start: 0,
					limit: limit,
				},
			},
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});

		console.log(
			`✅ Found ${response.data.data.length} products from Kroger`,
		);
		return response.data.data;
	} catch (error) {
		console.error("Error searching Kroger products:", error.message);
		throw new Error(`Failed to search Kroger products: ${error.message}`);
	}
};

// ^ Get Product Details from Kroger
export const getKrogerProductDetails = async (productId) => {
	try {
		const token = await getKrogerAccessToken();

		const response = await axios.get(
			`${KROGER_API_URL}/products/${productId}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			},
		);

		return response.data.data[0];
	} catch (error) {
		console.error("Error getting Kroger product details:", error.message);
		throw new Error(`Failed to get product details: ${error.message}`);
	}
};

// ^ Transform Kroger Product to Your Format
export const transformKrogerProduct = (krogerProduct) => {
	return {
		// MongoDB _id - use Kroger productId as reference
		productId: krogerProduct.productId,
		externalId: krogerProduct.productId, // Reference to Kroger
		source: "kroger", // Track where product came from

		// Basic Info
		name: krogerProduct.name || "Unknown Product",
		description: krogerProduct.description || "",
		brand: krogerProduct.brand || "Generic",

		// Pricing
		regularPrice: krogerProduct.price?.regular || 0,
		offerPrice:
			krogerProduct.price?.promo || krogerProduct.price?.regular || 0,

		// Images
		image: [
			krogerProduct.images?.find((img) => img.size === "large")?.url ||
				krogerProduct.images?.[0]?.url ||
				"https://via.placeholder.com/300?text=No+Image",
		],

		// Category
		category: krogerProduct.categories?.[0] || "General",
		subCategory: krogerProduct.categories?.[1] || "",

		// Stock/Availability
		stock: krogerProduct.fulfillment?.inStore ? 100 : 0, // Use 100 if in stock
		inStock: krogerProduct.fulfillment?.inStore || false,

		// Additional Info
		upc: krogerProduct.upc || "",
		size: krogerProduct.size || "",

		// Metadata
		createdAt: new Date(),
		updatedAt: new Date(),
		isKrogerProduct: true,
	};
};
