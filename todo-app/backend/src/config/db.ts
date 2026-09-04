import mongoose from "mongoose";

// Connects to MongoDB using the URI from environment variables.
// Called once when the server starts up.
export const connectDB = async (): Promise<void> => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error("MONGO_URI is not defined in your .env file");
    }
    await mongoose.connect(uri);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1); // stop the server if DB connection fails
  }
};
