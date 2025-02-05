import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable in your .env file');
}

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {
        useUnifiedTopology: true,
        dbName: "Lumo"
        });
        console.log("MongoDB connected");
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

export default connectDB;