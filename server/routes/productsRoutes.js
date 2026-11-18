import express from "express";
import {
	fetchHolisticMealProducts,
	mealDbCategories,
} from "../utils/themealdbProducts.js";

const productsRouter = express.Router();

const respond = async (request, response, options) => {
	try {
		const products = await fetchHolisticMealProducts(options);
		return response.json({
			success: true,
			products,
			total: products.length,
			source: "themealdb",
		});
	} catch (error) {
		console.error("Product request error:", error.message);
		return response.json({
			success: false,
			message: error.message,
			products: [],
			total: 0,
			source: "themealdb",
		});
	}
};

productsRouter.get("/search", (request, response) => {
	const { query = "healthy", limit = 50 } = request.query;
	return respond(request, response, {
		query: String(query).trim(),
		limit: Number(limit) || 50,
	});
});

productsRouter.get("/category/:category", (request, response) => {
	const { category } = request.params;
	const { limit = 50 } = request.query;
	return respond(request, response, {
		category: String(category || ""),
		limit: Number(limit) || 50,
	});
});

productsRouter.get("/featured", (_request, response) =>
	respond(_request, response, { query: "healthy", limit: 20 }),
);

productsRouter.get("/categories", (_request, response) =>
	response.json({
		success: true,
		categories: mealDbCategories(),
		source: "themealdb",
	}),
);

export default productsRouter;
