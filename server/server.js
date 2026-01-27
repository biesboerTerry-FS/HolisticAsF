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

const app = express();

const port = process.env.PORT || 4000;

await connectDb();
await connectCloudinary();

const allowedOrigins = ["http://localhost:5173"];

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.get("/", (request, response) => response.send("API connected"));
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/inventory", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter);

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
