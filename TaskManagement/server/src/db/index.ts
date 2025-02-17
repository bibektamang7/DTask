import mongoose from "mongoose";
import { DB_NAME } from "../constant";
const connectDB = async () => {
	try {
		await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}?replicaSet=rs0`);
	} catch (error) {
		console.log("Something went wrong while connection MongoDB", error);
		process.exit(1);
	}
};

export { connectDB };
