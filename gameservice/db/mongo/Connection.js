const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connect = async () => {
  console.log("🔌 Attempting to connect to MongoDB...");
  try {
    const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/bd";
    console.log("🚀 Connecting to MongoDB at:", dbUrl);

    await mongoose.connect(dbUrl);
    console.log("✅ Successfully connected to MongoDB.");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    throw error;
  }
};

const disconnect = async () => {
  try {
    await mongoose.disconnect();
    console.log("🔌 MongoDB connection closed successfully.");
  } catch (error) {
    console.error("⚠️ Error closing MongoDB connection:", error);
    throw error;
  }
};

module.exports = { connect, disconnect };
