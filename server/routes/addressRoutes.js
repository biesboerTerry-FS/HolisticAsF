import express from "express";
import authUser from "../middleware/authUser.js";
import {
	addAddress,
	getAddresses,
	updateAddress,
	deleteAddress,
	setDefaultAddress,
} from "../controllers/addressController.js";

const addressRouter = express.Router();

addressRouter.use(authUser);

addressRouter.post("/add-address", addAddress);
addressRouter.get("/get-addresses", getAddresses);
addressRouter.patch("/:id", updateAddress);
addressRouter.delete("/:id", deleteAddress);
addressRouter.post("/:id/default", setDefaultAddress);

export default addressRouter;
