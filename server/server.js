import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Import your schemas from models
import Contact from "./models/Contact.js";
import Quote from "./models/Quote.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/brick_industry")
  .then(() => console.log(" Connected to MongoDB"))
  .catch((err) => console.error(" MongoDB connection error:", err.message));

// Basic Test Route
app.get("/", (req, res) => {
  res.send("Brick Industry API is running");
});

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "active" });
});

// 1. Contact Form Route
app.post("/api/contact", async (req, res) => {
  try {
    const { name, phone, email, subject, message } = req.body;

    if (!name || !phone || !email || !subject || !message) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const newContact = await Contact.create({
      name,
      phone,
      email,
      subject,
      message,
    });

    console.log(" New Contact Saved:", newContact._id);
    res.status(201).json({ success: true, messageId: newContact._id });
  } catch (error) {
    console.error("Error saving contact message:", error);
    res.status(500).json({ error: "Server error saving inquiry." });
  }
});

// 2. Quote Request Route
app.post("/api/quotes", async (req, res) => {
  try {
    const { fullName, phone, email, productName, quantity, deliverySite, notes } = req.body;

    if (!fullName || !phone || !email || !productName || !quantity || !deliverySite) {
      return res.status(400).json({ error: "Please fill in all required fields." });
    }

    const newQuote = await Quote.create({
      fullName,
      phone,
      email,
      productName,
      quantity,
      deliverySite,
      notes,
    });

    console.log(" New Quote Request Saved:", newQuote._id);
    res.status(201).json({ success: true, quoteId: newQuote._id });
  } catch (error) {
    console.error("Error saving quote:", error);
    res.status(500).json({ error: "Server error processing quote." });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});