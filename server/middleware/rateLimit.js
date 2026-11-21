// Small dependency-free in-memory limiter. On serverless each instance keeps
// its own counters, which is fine for basic brute-force/demo abuse protection.

const buckets = new Map();

/**
 * @param {{windowMs?: number, max?: number, prefix?: string, message?: string}} options
 */
export const rateLimit = ({
	windowMs = 60 * 1000,
	max = 10,
	prefix = "general",
	message = "Too many requests. Please try again later.",
} = {}) => {
	const limit = (request, response, next) => {
		const now = Date.now();
		const ip =
			request.ip ||
			request.headers?.["x-forwarded-for"]?.split(",")[0]?.trim() ||
			request.socket?.remoteAddress ||
			"unknown";
		const key = `${prefix}:${ip}`;

		let bucket = buckets.get(key);
		if (!bucket || now - bucket.start >= windowMs) {
			bucket = { start: now, count: 0 };
			buckets.set(key, bucket);
		}

		bucket.count += 1;
		if (bucket.count > max) {
			response.setHeader(
				"Retry-After",
				Math.ceil((bucket.start + windowMs - now) / 1000),
			);
			return response.status(429).json({ success: false, message });
		}

		// Keep the map bounded over time.
		if (buckets.size > 5000) {
			for (const [bucketKey, value] of buckets) {
				if (now - value.start >= windowMs) buckets.delete(bucketKey);
			}
		}

		return next();
	};

	return limit;
};

export const loginLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 20,
	prefix: "login",
	message: "Too many login attempts. Please try again later.",
});

export const demoLimiter = rateLimit({
	windowMs: 60 * 1000,
	max: 15,
	prefix: "demo",
	message: "Too many demo requests. Please slow down.",
});

export const submitLimiter = rateLimit({
	windowMs: 60 * 1000,
	max: 10,
	prefix: "submit",
	message: "Too many submissions. Please slow down.",
});
