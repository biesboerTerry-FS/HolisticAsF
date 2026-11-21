// Standalone seed: `npm run seed:hr` (or the API seeds itself on first use).
import "dotenv/config";
import mongoose from "mongoose";
import ensureHrSeed from "../utils/hrSeed.js";

const run = async () => {
	if (!process.env.MONGODB_URI) {
		throw new Error("MONGODB_URI is not set in server/.env");
	}
	await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
	console.log(`connected to ${mongoose.connection.name}`);
	await ensureHrSeed();
	console.log("HR demo data ensured");
};

run()
	.catch((error) => {
		console.error("HR seed failed:", error.message);
		process.exitCode = 1;
	})
	.finally(() => mongoose.disconnect());
