import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDb from "./configs/db.js";
import "dotenv/config";
import userRouter from "./routes/userRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import productRouter from "./routes/productRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import addressRouter from "./routes/addressRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import connectCloudinary from "./configs/cloudinary.js";
import productsRouter from "./routes/productsRoutes.js";
import newsletterRouter from "./routes/newsletterRoute.js";
import contactRouter from "./routes/contactRoutes.js";
import employeeRouter from "./routes/employeeRoutes.js";
import fetch from "node-fetch";
import * as Sentry from "@sentry/node";

if (process.env.SENTRY_DSN) {
	Sentry.init({
		dsn: process.env.SENTRY_DSN,
		tracesSampleRate: 0.1,
	});
}

const app = express();

const port = process.env.PORT || 4000;

let dbConnected = false;
const ensureDb = async () => {
	if (!dbConnected) {
		await connectDb();
		dbConnected = true;
	}
};

let cloudinaryConnected = false;
const ensureCloudinary = async () => {
	if (!cloudinaryConnected) {
		await connectCloudinary();
		cloudinaryConnected = true;
	}
};

const allowedOrigin = process.env.CORS_ORIGIN || [
	"http://localhost:5173",
	"http://localhost:5176",
	"http://127.0.0.1:5173",
	"http://127.0.0.1:5176",
];

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigin, credentials: true }));

app.get("/", (request, response) => response.send("API connected"));
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/inventory", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter);
app.use("/api/products", productsRouter);
// Legacy alias — the product source is TheMealDB only.
app.use("/api/kroger", productsRouter);
app.use("/api/newsletter", newsletterRouter);
app.use("/api/contact", contactRouter);
app.use("/api/employees", employeeRouter);

app.get("/api/media/image", async (req, res) => {
	try {
		const { upc } = req.query;

		if (!upc) {
			return res.status(400).send("Missing product id");
		}

		// Products now come from TheMealDB. IDs are stored as "mealdb-<id>".
		const mealId = String(upc).replace(/^mealdb-/, "");
		const lookup = await fetch(
			`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${encodeURIComponent(mealId)}`,
		);
		const data = await lookup.json();
		const imageUrl = data?.meals?.[0]?.strMealThumb;

		if (!imageUrl) {
			return res.redirect("/fallback.png");
		}

		const response = await fetch(imageUrl);
		if (!response.ok) {
			return res.redirect("/fallback.png");
		}

		res.setHeader("Content-Type", response.headers.get("content-type"));
		response.body.pipe(res);
	} catch (err) {
		console.error("Image proxy error:", err.message);
		res.redirect("/fallback.png");
	}
});

app.use((error, request, response, next) => {
	console.error("Server error:", error);
	response.status(500).json({
		success: false,
		message: error.message,
	});
});

if (process.env.NODE_ENV !== "production" || process.env.VERCEL !== "1") {
	ensureDb().then(() => {
		app.listen(port, () => {
			console.log(`Server is running on http://localhost:${port}`);
		});
	});
}

export default async function handler(request, response) {
	await ensureDb();
	await ensureCloudinary();
	return app(request, response);
}
