import express from "express";
import authUser from "../middleware/authUser.js";
import {
	addAddress,
	getAddresses,
	// deleteAddress,
} from "../controllers/addressController.js";

const addressRouter = express.Router();

addressRouter.post("/add-address", authUser, addAddress);
addressRouter.get("/get-addresses", authUser, getAddresses);
// addressRouter.delete("/delete-address", authUser, deleteAddress);

export default addressRouter;
