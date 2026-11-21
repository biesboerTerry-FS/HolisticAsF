import express from "express";
import { upload } from "../configs/multer.js";
import {
	addProduct,
	inventoryList,
	productById,
} from "../controllers/productController.js";
import authAdmin from "../middleware/authAdmin.js";

const productRouter = express.Router();

// Inventory changes are privileged; browsing the inventory stays public.
productRouter.post(
	"/add-inventory",
	authAdmin,
	upload.array(["images"]),
	addProduct,
);
productRouter.get("/inventory", inventoryList);
productRouter.get("/product/:id", productById);

export default productRouter;
