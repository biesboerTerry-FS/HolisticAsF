import axios from "axios";

const API = axios.create({
	baseURL: import.meta.env.VITE_BACKEND_URL,
	withCredentials: true,
});

const KrogerApi = {
	searchProducts: async (query, limit = 50) => {
		const { data } = await API.get("/api/products/search", {
			params: { query, limit },
		});
		return data;
	},

	getProductsByCategory: async (category, limit = 50) => {
		const { data } = await API.get(`/api/products/category/${category}`, {
			params: { limit },
		});
		return data;
	},

	getFeaturedProducts: async () => {
		const { data } = await API.get("/api/products/featured");
		return data;
	},
};

export default KrogerApi;
