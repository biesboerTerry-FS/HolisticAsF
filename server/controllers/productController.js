import { v2 as cloudinary } from "cloudinary";
import Product from "../models/Product.js";

// ^ add new product: /api/inventory/add-inventory`
export const addProduct = async (request, response) => {
	try {
		let productData = JSON.parse(request.body.productData);

		const images = request.files;

		let imagesUrl = await Promise.all(
			images.map(async (item) => {
				let result = await cloudinary.uploader.upload(item.path, {
					resource_type: "image",
				});
				return result.secure_url;
			}),
		);

		await Product.create({ ...productData, image: imagesUrl });

		response.json({
			success: true,
			message: "Product added.",
		});
	} catch (error) {
		console.log(error.message);
		response.json({
			success: false,
			error: error.message,
		});
	}
};

// ^ get all products: /api/inventory/
export const inventoryList = async (request, response) => {
	try {
		const products = await Product.find({});
		response.json({
			success: true,
			products,
		});
	} catch (error) {
		console.log(error.message);
		response.json({
			success: false,
			error: error.message,
		});
	}
};

// ^ get product by id: /api/inventory/:id
export const productById = async (request, response) => {
	try {
		const { id } = request.params.id;
		const product = await Product.findById(id);
		response.json({
			success: true,
			product,
		});
	} catch (error) {
		console.log(error.message);
		response.json({
			success: false,
			error: error.message,
		});
	}
};

// ^ inStock status: /api/inventory/stock
export const inStockStatus = async (request, response) => {
	try {
		const { id, inStock } = request.body;
		await Product.findByIdAndUpdate(id, { inStock });
		response.json({
			success: true,
			message: "Stock status updated.",
		});
	} catch (error) {
		console.log(error.message);
		response.json({
			success: false,
			error: error.message,
		});
	}
};
