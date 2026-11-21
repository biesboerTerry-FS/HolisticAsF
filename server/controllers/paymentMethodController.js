import PaymentMethod from "../models/PaymentMethod.js";
import { resolveUserId } from "../utils/resolveUser.js";

const text = (value) => String(value ?? "").trim();
const FORBIDDEN_KEYS = ["number", "cardnumber", "card", "cvc", "cvv", "pan", "pin"];

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

const hasForbiddenFields = (body = {}) =>
	Object.keys(body).some((key) => FORBIDDEN_KEYS.includes(key.toLowerCase()));

const validateDemoCard = (body = {}) => {
	const last4 = text(body.last4);
	if (!/^\d{4}$/.test(last4)) {
		return { error: "Enter exactly the last 4 digits of the test card." };
	}
	const exp = text(body.exp);
	if (exp && !/^\d{2}\/\d{2}$/.test(exp)) {
		return { error: "Expiry must be in MM/YY format." };
	}
	if (hasForbiddenFields(body)) {
		return { error: "Real card data is never accepted. Demo cards only." };
	}
	return {
		value: {
			brand: text(body.brand) || "Test card",
			last4,
			exp,
			label: text(body.label) || "Test card",
			isDefault: Boolean(body.isDefault),
			demo: true,
		},
	};
};

const clearOtherDefaults = async (userId, exceptId = null) => {
	await PaymentMethod.updateMany(
		{ userId, isDefault: true, ...(exceptId ? { _id: { $ne: exceptId } } : {}) },
		{ $set: { isDefault: false } },
	);
};

// The storefront always shows a seeded test card so the demo is obvious.
const seedTestCard = async (userId) => {
	const count = await PaymentMethod.countDocuments({ userId });
	if (count > 0) return;
	await PaymentMethod.create({
		userId,
		brand: "Test card",
		last4: "4242",
		exp: "12/30",
		label: "Test card",
		isDefault: true,
		demo: true,
	});
};

// ^ list demo payment methods: GET /api/payment-methods
export const getPaymentMethods = async (request, response) => {
	try {
		const userId = await requireUser(request, response);
		if (!userId) return;
		await seedTestCard(userId);

		const methods = await PaymentMethod.find({ userId }).sort({
			isDefault: -1,
			createdAt: 1,
		});
		return response.json({ success: true, paymentMethods: methods });
	} catch (error) {
		console.log(error.message, "get payment methods");
		return response.json({ success: false, message: error.message });
	}
};

// ^ add demo card (masked metadata only): POST /api/payment-methods
export const addPaymentMethod = async (request, response) => {
	try {
		const userId = await requireUser(request, response);
		if (!userId) return;

		const { error, value } = validateDemoCard(request.body);
		if (error) return response.json({ success: false, message: error });

		if (value.isDefault) await clearOtherDefaults(userId);

		const created = await PaymentMethod.create({ ...value, userId });
		return response.json({
			success: true,
			message: "Demo card saved (test mode only).",
			paymentMethod: created,
		});
	} catch (error) {
		console.log(error.message, "add payment method");
		return response.json({ success: false, message: error.message });
	}
};

// ^ edit demo card label/expiry/default: PATCH /api/payment-methods/:id
export const updatePaymentMethod = async (request, response) => {
	try {
		const userId = await requireUser(request, response);
		if (!userId) return;
		if (hasForbiddenFields(request.body)) {
			return response.json({
				success: false,
				message: "Real card data is never accepted. Demo cards only.",
			});
		}

		const method = await PaymentMethod.findOne({
			_id: request.params.id,
			userId,
		});
		if (!method) {
			return response
				.status(404)
				.json({ success: false, message: "Demo card not found." });
		}

		const exp = request.body?.exp === undefined ? method.exp : text(request.body.exp);
		if (exp && !/^\d{2}\/\d{2}$/.test(exp)) {
			return response.json({
				success: false,
				message: "Expiry must be in MM/YY format.",
			});
		}

		if (request.body?.isDefault) await clearOtherDefaults(userId, method._id);

		method.label = request.body?.label === undefined ? method.label : text(request.body.label);
		if (request.body?.isDefault !== undefined) {
			method.isDefault = Boolean(request.body.isDefault);
		}
		// A card cannot be un-defaulted without another default taking over.
		if (!method.isDefault) {
			const otherDefault = await PaymentMethod.findOne({
				userId,
				isDefault: true,
				_id: { $ne: method._id },
			});
			if (!otherDefault) method.isDefault = true;
		}
		method.exp = exp;
		await method.save();

		return response.json({
			success: true,
			message: "Demo card updated.",
			paymentMethod: method,
		});
	} catch (error) {
		console.log(error.message, "update payment method");
		return response.json({ success: false, message: error.message });
	}
};

// ^ delete demo card: DELETE /api/payment-methods/:id
export const deletePaymentMethod = async (request, response) => {
	try {
		const userId = await requireUser(request, response);
		if (!userId) return;

		const deleted = await PaymentMethod.findOneAndDelete({
			_id: request.params.id,
			userId,
		});
		if (!deleted) {
			return response
				.status(404)
				.json({ success: false, message: "Demo card not found." });
		}

		if (deleted.isDefault) {
			const next = await PaymentMethod.findOne({ userId }).sort({ createdAt: 1 });
			if (next) {
				next.isDefault = true;
				await next.save();
			}
		}

		return response.json({ success: true, message: "Demo card removed." });
	} catch (error) {
		console.log(error.message, "delete payment method");
		return response.json({ success: false, message: error.message });
	}
};
