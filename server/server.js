import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import { protect } from "./middleware/auth.js";
import {
  sendInquiryAlert,
  sendInquiryCustomerAck,
  sendQuoteAlert,
  sendQuoteCustomerAck,
} from "./utils/mailer.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb://127.0.0.1:27017/brick_industry";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB Atlas successfully"))
  .catch((err) => console.error("MongoDB Atlas connection error:", err.message));

// Contact Inquiry Schema & Model
const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["New", "Under Review", "Closed"],
      default: "New",
    },
  },
  { timestamps: true }
);

const Contact = mongoose.model("Contact", contactSchema);

// Quotation RFQ Schema & Model
const quoteSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    productName: { type: String, required: true },
    quantity: { type: String, required: true },
    deliverySite: { type: String, required: true },
    notes: { type: String, default: "" },
    status: {
      type: String,
      enum: ["New", "Under Review", "Quotation Sent", "Accepted", "Rejected"],
      default: "New",
    },
  },
  { timestamps: true }
);

// Product Schema & Model
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true, default: "Clay Bricks" },
    pricePerUnit: { type: Number, required: true },
    moq: { type: Number, default: 5000 },
    strength: { type: String, required: true }, // e.g., "15 - 20 N/mm²"
    dimensions: { type: String, required: true }, // e.g., "190 x 90 x 90 mm"
    stockStatus: {
      type: String,
      enum: ["In Stock", "Made to Order", "Low Stock"],
      default: "In Stock",
    },
    imageUrl: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

const Quote = mongoose.model("Quote", quoteSchema);

// Public Contact Route
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

    Promise.allSettled([
      sendInquiryAlert(newContact),
      sendInquiryCustomerAck(newContact),
    ]).then((results) => {
      results.forEach((r, index) => {
        const target = index === 0 ? "Admin Alert" : "Customer Ack";
        if (r.status === "rejected") {
          console.error(`❌ [${target}] failed:`, r.reason?.message);
        } else {
          console.log(`📧 [${target}] dispatched successfully.`);
        }
      });
    });

    res.status(201).json({ success: true, messageId: newContact._id });
  } catch (error) {
    console.error("Contact route error:", error);
    res.status(500).json({ error: "Server error saving inquiry." });
  }
});

// Public Quote RFQ Route
app.post("/api/quotes", async (req, res) => {
  try {
    const { fullName, phone, email, productName, quantity, deliverySite, notes } =
      req.body;
    if (
      !fullName ||
      !phone ||
      !email ||
      !productName ||
      !quantity ||
      !deliverySite
    ) {
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

    Promise.allSettled([
      sendQuoteAlert(newQuote),
      sendQuoteCustomerAck(newQuote),
    ]).then((results) => {
      results.forEach((r, index) => {
        const target = index === 0 ? "Admin Alert" : "Customer RFQ Ack";
        if (r.status === "rejected") {
          console.error(`❌ [${target}] failed:`, r.reason?.message);
        } else {
          console.log(`📧 [${target}] dispatched successfully.`);
        }
      });
    });

    res.status(201).json({ success: true, quoteId: newQuote._id });
  } catch (error) {
    console.error("Quote route error:", error);
    res.status(500).json({ error: "Server error processing quotation." });
  }
});

// Admin Login Route
app.post("/api/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required." });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET || "super_secret_industrial_brick_jwt_key_2026",
      { expiresIn: "8h" }
    );

    res.json({
      token,
      user: { id: user._id, username: user.username, role: user.role },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error during authentication." });
  }
});

// Admin Protected Routes
app.get("/api/admin/quotes", protect, async (req, res) => {
  try {
    const quotes = await Quote.find().sort({ createdAt: -1 });
    res.json(quotes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch quotes." });
  }
});

app.patch("/api/admin/quotes/:id/status", protect, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = [
      "New",
      "Under Review",
      "Quotation Sent",
      "Accepted",
      "Rejected",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid quotation status." });
    }

    const updated = await Quote.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Quote not found." });

    res.json({ success: true, quote: updated });
  } catch (err) {
    res.status(500).json({ error: "Failed to update quotation status." });
  }
});

app.get("/api/admin/inquiries", protect, async (req, res) => {
  try {
    const inquiries = await Contact.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch inquiries." });
  }
});

app.patch("/api/admin/inquiries/:id/status", protect, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["New", "Under Review", "Closed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid inquiry status." });
    }

    const updated = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Inquiry not found." });

    res.json({ success: true, inquiry: updated });
  } catch (err) {
    res.status(500).json({ error: "Failed to update inquiry status." });
  }
});

app.delete("/api/admin/quotes/:id", protect, async (req, res) => {
  try {
    await Quote.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Quote deleted." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete quote." });
  }
});

app.delete("/api/admin/inquiries/:id", protect, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Inquiry deleted." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete inquiry." });
  }
});

// ----------------------------------------------------
// Product CRUD Endpoints
// ----------------------------------------------------

// 1. Public: Get All Active Products
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve products." });
  }
});

// 2. Protected: Create New Product
app.post("/api/admin/products", protect, async (req, res) => {
  try {
    const { name, category, pricePerUnit, moq, strength, dimensions, stockStatus, imageUrl, description } = req.body;
    if (!name || !pricePerUnit || !strength || !dimensions) {
      return res.status(400).json({ error: "Name, price, strength, and dimensions are required." });
    }

    const newProduct = await Product.create({
      name,
      category,
      pricePerUnit,
      moq,
      strength,
      dimensions,
      stockStatus,
      imageUrl,
      description,
    });

    res.status(201).json({ success: true, product: newProduct });
  } catch (err) {
    console.error("Create product error:", err);
    res.status(500).json({ error: "Failed to create product." });
  }
});

// 3. Protected: Update Existing Product
app.put("/api/admin/products/:id", protect, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ error: "Product not found." });

    res.json({ success: true, product: updated });
  } catch (err) {
    console.error("Update product error:", err);
    res.status(500).json({ error: "Failed to update product." });
  }
});

// 4. Protected: Delete Product
app.delete("/api/admin/products/:id", protect, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Product not found." });

    res.json({ success: true, message: "Product deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});