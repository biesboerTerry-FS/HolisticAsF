import express from "express";
import { upload } from "../configs/multer.js";
import {
	addProduct,
	inventoryList,
	productById,
} from "../controllers/productController.js";
import authAdmin from "../middleware/authAdmin.js";

const productRouter = express.Router();

productRouter.post(
	"/add-inventory",
	upload.array(["images"]),
	authAdmin,
	addProduct,
);
productRouter.get("/inventory", inventoryList);
productRouter.get("/product/:id", productById);

export default productRouter;
