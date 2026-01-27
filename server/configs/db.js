import mongoose from "mongoose";

const connectDb = async () => {
	try {
		await mongoose.connection.on("connected", () =>
			console.log("Database connected"),
		);
		await mongoose.connect(`${process.env.MONGODB_URI}`);
	} catch (error) {
		console.log(error.message);
	}
};

export default connectDb;
