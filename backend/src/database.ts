import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/pokemon-db";

export async function connectDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
    console.log("Database:", mongoose.connection.name);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
  console.log("Disconnected from MongoDB");
}

mongoose.connection.on("error", (error) => {
  console.error("MongoDB error:", error);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});
