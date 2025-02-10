import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB environment variable in your .env file');
}

// Global cache to store connection across API calls (to prevent multiple connections)
let cached = (global)._mongoose || { conn: null, promise: null };

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn; // Return existing connection if already established
  }

  if (!cached.promise) {
    // Create a new connection if one doesn't exist
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      useNewUrlParser: true,
      useUnifiedTopology: true, // Ensure stable connections
      dbName: "Lumo",
    }).then((mongoose) => {
      console.log("MongoDB connected ✅");
      return mongoose;
    }).catch((error) => {
      console.error("MongoDB connection error ❌", error);
      cached.promise = null; // Reset promise on failure to prevent using a failed connection
      throw error;
    });
  }

  cached.conn = await cached.promise;
  (global)._mongoose = cached;

  return cached.conn;
};

export default connectDB;
