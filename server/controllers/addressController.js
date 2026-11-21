import Address from "../models/Address.js";
import User from "../models/User.js";
import { resolveUserId } from "../utils/resolveUser.js";

const text = (value) => String(value ?? "").trim();

// Normalize the profile form's field names into one canonical shape, while
// mirroring the values into the legacy fields that /cart reads.
const normalizeAddress = (body = {}) => {
	const line1 = text(body.line1 || body.streetLine1);
	const line2 = text(body.line2 || body.streetLine2);
	const zip = text(body.zip || body.zipCode);
	const firstName = text(body.firstName);
	const lastName = text(body.lastName);

	return {
		label: text(body.label) || "Shipping",
		line1,
		line2,
		city: text(body.city),
		state: text(body.state),
		zip,
		country: text(body.country) || "US",
		firstName,
		lastName,
		streetLine1: line1,
		streetLine2: line2,
		zipCode: zip,
		phone: text(body.phone),
		email: text(body.email),
		isDefault: Boolean(body.isDefault),
	};
};

const validAddress = (address) =>
	address.line1 && address.city && address.state && address.zip;

const requireUser = async (request, response) => {
	const userId = await resolveUserId(request);
	if (!userId) {
		response.status(401).json({
			success: false,
			message: "Authentication required.",
		});
		return null;
	}
	return userId;
};

// Clearing other defaults keeps exactly one default shipping address per user.
const clearOtherDefaults = async (userId, exceptId = null) => {
	await Address.updateMany(
		{ userId, isDefault: true, ...(exceptId ? { _id: { $ne: exceptId } } : {}) },
		{ $set: { isDefault: false } },
	);
};

// ^ add address: POST /api/address/add-address
export const addAddress = async (request, response) => {
	try {
		const userId = await requireUser(request, response);
		if (!userId) return;

		const address = normalizeAddress(request.body);
		if (!validAddress(address)) {
			return response.json({
				success: false,
				message: "Please complete all required address fields.",
			});
		}

		if (address.isDefault) await clearOtherDefaults(userId);

		const created = await Address.create({ ...address, userId });
		await User.findByIdAndUpdate(userId, {
			$addToSet: { addresses: created._id },
		});

		return response.json({
			success: true,
			message: "Address added successfully.",
			address: created,
		});
	} catch (error) {
		console.log(error.message, "Error in addAddress:");
		return response.json({ success: false, message: error.message });
	}
};

// ^ get addresses: GET /api/address/get-addresses
export const getAddresses = async (request, response) => {
	try {
		const userId = await requireUser(request, response);
		if (!userId) return;

		const addresses = await Address.find({ userId }).sort({
			isDefault: -1,
			createdAt: 1,
		});

		return response.json({ success: true, addresses });
	} catch (error) {
		console.log(error.message, "get addresses");
		return response.json({ success: false, message: error.message });
	}
};

// ^ edit address: PATCH /api/address/:id
export const updateAddress = async (request, response) => {
	try {
		const userId = await requireUser(request, response);
		if (!userId) return;

		const address = normalizeAddress(request.body);
		if (!validAddress(address)) {
			return response.json({
				success: false,
				message: "Please complete all required address fields.",
			});
		}

		const existing = await Address.findOne({ _id: request.params.id, userId });
		if (!existing) {
			return response.status(404).json({
				success: false,
				message: "Address not found.",
			});
		}

		if (address.isDefault) await clearOtherDefaults(userId, existing._id);

		const updated = await Address.findByIdAndUpdate(
			existing._id,
			{ $set: { ...address, isDefault: address.isDefault || existing.isDefault } },
			{ new: true, runValidators: true },
		);

		return response.json({
			success: true,
			message: "Address updated.",
			address: updated,
		});
	} catch (error) {
		console.log(error.message, "update address");
		return response.json({ success: false, message: error.message });
	}
};

// ^ delete address: DELETE /api/address/:id
export const deleteAddress = async (request, response) => {
	try {
		const userId = await requireUser(request, response);
		if (!userId) return;

		const deleted = await Address.findOneAndDelete({
			_id: request.params.id,
			userId,
		});
		if (!deleted) {
			return response.status(404).json({
				success: false,
				message: "Address not found.",
			});
		}

		await User.findByIdAndUpdate(userId, { $pull: { addresses: deleted._id } });

		return response.json({
			success: true,
			message: "Address removed.",
		});
	} catch (error) {
		console.log(error.message, "delete address");
		return response.json({ success: false, message: error.message });
	}
};

// ^ set default shipping: POST /api/address/:id/default
export const setDefaultAddress = async (request, response) => {
	try {
		const userId = await requireUser(request, response);
		if (!userId) return;

		const address = await Address.findOne({ _id: request.params.id, userId });
		if (!address) {
			return response.status(404).json({
				success: false,
				message: "Address not found.",
			});
		}

		await clearOtherDefaults(userId);
		address.isDefault = true;
		await address.save();

		return response.json({
			success: true,
			message: "Default shipping address updated.",
			address,
		});
	} catch (error) {
		console.log(error.message, "set default address");
		return response.json({ success: false, message: error.message });
	}
};
