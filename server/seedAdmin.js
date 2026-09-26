import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/brick_industry";

async function fixAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB.");

    // Direct collection access bypasses all Mongoose pre-save middleware hooks
    const db = mongoose.connection.db;
    const usersCollection = db.collection("users");

    // Remove existing admin
    await usersCollection.deleteMany({ username: "admin" });

    // Hash exactly once
    const salt = await bcrypt.genSalt(10);
    const singleHashedPassword = await bcrypt.hash("BrickAdmin@2026", salt);

    await usersCollection.insertOne({
      username: "admin",
      password: singleHashedPassword,
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log("✅ Admin user created with clean single hash!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Failed:", err.message);
    process.exit(1);
  }
}



fixAdmin();