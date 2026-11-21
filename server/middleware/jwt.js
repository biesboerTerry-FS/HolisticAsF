import crypto from "node:crypto";
import jwt from "jsonwebtoken";

// Shared JWT helpers. Keeping signing/verification in one place means every
// protected route gets the same signature + expiry checks and the same 401s.

const WEAK_SECRETS = new Set([
	"secret",
	"jwtsecret",
	"changeme",
	"change-me",
	"dev",
	"test",
	"password",
	"supersecret",
	"your-secret-key",
	"your_secret_key",
]);

let cachedSecret;

const isProduction = () =>
	process.env.NODE_ENV === "production" ||
	process.env.VERCEL === "1" ||
	process.env.VERCEL_ENV === "production";

/**
 * Resolve the signing secret. Production requires a strong secret from the
 * environment; there is deliberately no weak production fallback. Local dev
 * gets an ephemeral high-entropy secret so the app still starts without a .env.
 */
export const getJwtSecret = () => {
	if (cachedSecret) return cachedSecret;

	const secret = process.env.JWT_SECRET;
	const production = isProduction();

	if (!secret) {
		if (production) {
			throw new Error("JWT_SECRET must be configured in production.");
		}
		cachedSecret = crypto.randomBytes(48).toString("hex");
		return cachedSecret;
	}

	if (secret.length < 32 || WEAK_SECRETS.has(secret.toLowerCase())) {
		if (production) {
			throw new Error(
				"JWT_SECRET is too weak for production (use at least 32 random characters).",
			);
		}
		console.warn(
			"Warning: JWT_SECRET is short/weak. Set a 32+ character random value.",
		);
	}

	cachedSecret = secret;
	return secret;
};

/** Pull a token from the `Authorization: Bearer ...` header, if present. */
export const bearerToken = (request) => {
	const header = request?.headers?.authorization;
	if (typeof header !== "string") return null;
	const match = /^Bearer\s+(.+)$/i.exec(header);
	return match ? match[1].trim() : null;
};

/** Read a token from a cookie first, then fall back to a Bearer header. */
export const readToken = (request, cookieName) =>
	request?.cookies?.[cookieName] || bearerToken(request) || null;

/**
 * Verify signature + expiry. Returns the decoded payload or null; never throws
 * token details back to the client (no information / token leakage).
 */
export const verifyToken = (token) => {
	if (!token || typeof token !== "string") return null;
	try {
		return jwt.verify(token, getJwtSecret(), { algorithms: ["HS256"] });
	} catch {
		return null;
	}
};

/** Uniform 401 response for all authentication failures. */
export const unauthorized = (
	response,
	message = "Authentication required.",
) => response.status(401).json({ success: false, message });
