import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import KrogerProduct from "../models/KrogerProduct.js";
import User from "../models/User.js";
import Address from "../models/Address.js";
import Newsletter from "../models/Newsletter.js";
import Contact from "../models/Contact.js";
import Announcement from "../models/Announcement.js";
import Employee from "../models/Employee.js";
import Shift from "../models/Shift.js";
import products from "./data/products.js";

const SEED_PASSWORD = process.env.SEED_PASSWORD || "password123";

const seedProducts = async () => {
	const docs = await Promise.all(
		products.map((product) =>
			KrogerProduct.findOneAndUpdate(
				{ externalId: product.externalId },
				product,
				{ upsert: true, new: true, setDefaultsOnInsert: true },
			),
		),
	);
	console.log(`products: ${docs.length} upserted`);
	return docs;
};

const seedUsers = async () => {
	const hashed = await bcrypt.hash(SEED_PASSWORD, 10);
	const people = [
		{ name: "Bonita Applebaum", email: "bonita@example.com", clerkId: "seed_user_1" },
		{ name: "Marcus Lee", email: "marcus@example.com", clerkId: "seed_user_2" },
		{ name: "Priya Shah", email: "priya@example.com", clerkId: "seed_user_3" },
	];

	const users = [];
	for (const person of people) {
		users.push(
			await User.findOneAndUpdate(
				{ email: person.email },
				{ ...person, password: hashed, role: "user" },
				{ upsert: true, new: true, setDefaultsOnInsert: true },
			),
		);
	}
	console.log(`users: ${users.length} upserted (password: ${SEED_PASSWORD})`);
	return users;
};

const seedAdmin = async () => {
	const email = process.env.ADMIN_EMAIL;
	if (!email) {
		console.log("admin: skipped, ADMIN_EMAIL is not set");
		return null;
	}
	const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD || SEED_PASSWORD, 10);
	const admin = await User.findOneAndUpdate(
		{ email },
		{
			name: "Admin",
			email,
			clerkId: "seed_admin",
			password: hashed,
			role: "admin",
		},
		{ upsert: true, new: true, setDefaultsOnInsert: true },
	);
	console.log(`admin: ${admin.email} upserted`);
	return admin;
};

const seedAddresses = async (users) => {
	const addresses = [];
	for (const user of users) {
		const address = await Address.findOneAndUpdate(
			{ userId: user._id.toString(), streetLine1: "100 Main St" },
			{
				userId: user._id.toString(),
				firstName: user.name.split(" ")[0],
				lastName: user.name.split(" ").slice(1).join(" ") || "Doe",
				streetLine1: "100 Main St",
				streetLine2: "",
				city: "Portland",
				state: "OR",
				zipCode: "97203",
				phone: "5555555555",
				email: user.email,
			},
			{ upsert: true, new: true, setDefaultsOnInsert: true },
		);
		await User.updateOne(
			{ _id: user._id },
			{ $addToSet: { addresses: address._id } },
		);
		addresses.push(address);
	}
	console.log(`addresses: ${addresses.length} upserted`);
	return addresses;
};

const seedNewsletter = async () => {
	const emails = ["news1@example.com", "news2@example.com", "news3@example.com"];
	for (const email of emails) {
		await Newsletter.updateOne({ email }, { email }, { upsert: true });
	}
	console.log(`newsletter: ${emails.length} ensured`);
};

const seedContacts = async () => {
	const messages = [
		{ name: "Jordan Kim", email: "jordan@example.com", subject: "Delivery question", message: "Do you deliver to Vancouver, WA?", status: "new" },
		{ name: "Alex Rivera", email: "alex@example.com", subject: "Bulk order", message: "Can I order 50 units of the quinoa for an event?", status: "read" },
	];
	for (const msg of messages) {
		await Contact.updateOne({ email: msg.email, subject: msg.subject }, msg, { upsert: true });
	}
	console.log(`contacts: ${messages.length} ensured`);
};

const seedAnnouncements = async () => {
	const announcements = [
		{
			title: "Fresh harvest just landed",
			body: "New seasonal produce is in stock now — shop the latest arrivals and taste the difference.",
			type: "info",
			active: true,
		},
		{
			title: "20% off your first organic box",
			body: "Use code HOLISTIC20 at checkout to save on your first organic produce box. Limited time only!",
			type: "promotion",
			active: true,
		},
		{
			title: "Delivery delays this week",
			body: "We're experiencing minor delivery delays due to weather. Thanks for your patience — we're working to get orders out on time.",
			type: "warning",
			active: true,
		},
	];
	for (const announcement of announcements) {
		await Announcement.updateOne(
			{ title: announcement.title },
			{ $set: announcement },
			{ upsert: true, setDefaultsOnInsert: true },
		);
	}
	console.log(`announcements: ${announcements.length} ensured`);
};

const seedDemoEmployee = async () => {
	const demo = {
		employeeId: "demo-employee-1",
		name: "Jordan Rivera",
		email: "jordan@holisticaf.com",
		phone: "(555) 010-2044",
		address: "100 Holistic Way, Portland, OR 97203",
		position: "Store Associate",
		active: true,
	};
	const employee = await Employee.findOneAndUpdate(
		{ employeeId: demo.employeeId },
		{ $set: demo },
		{ upsert: true, new: true, setDefaultsOnInsert: true },
	);

	const pad = (n) => String(n).padStart(2, "0");
	const dateFromNow = (days) => {
		const date = new Date();
		date.setDate(date.getDate() + days);
		return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
	};
	const shifts = [
		{ date: dateFromNow(1), startTime: "09:00", endTime: "17:00", role: "Floor support", location: "HolisticAF Store" },
		{ date: dateFromNow(3), startTime: "10:00", endTime: "18:00", role: "Inventory restock", location: "HolisticAF Store" },
	].map((shift) => ({ ...shift, employee: employee._id, status: "scheduled" }));

	for (const shift of shifts) {
		await Shift.updateOne(
			{ employee: employee._id, date: shift.date, startTime: shift.startTime },
			{ $set: shift },
			{ upsert: true },
		);
	}
	console.log("demo employee: ensured (1 employee, 2 shifts)");
};

const run = async () => {
	if (!process.env.MONGODB_URI) {
		throw new Error("MONGODB_URI is not set in server/.env");
	}
	await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
	console.log(`connected to ${mongoose.connection.name}`);

	await seedProducts();
	const users = await seedUsers();
	await seedAdmin();
	await seedAddresses(users);
	await seedNewsletter();
	await seedContacts();
	await seedAnnouncements();
	await seedDemoEmployee();

	console.log("seed complete");
};

run()
	.catch((error) => {
		console.error("seed failed:", error.message);
		process.exitCode = 1;
	})
	.finally(() => mongoose.disconnect());
