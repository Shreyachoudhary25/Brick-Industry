import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/brick_industry";

const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  pricePerUnit: Number,
  moq: Number,
  strength: String,
  dimensions: String,
  stockStatus: String,
  imageUrl: String,
  description: String,
});

const Product = mongoose.model("Product", productSchema);

const initialProducts = [
  {
    name: "Red Clay Wire Cut Bricks",
    category: "Clay Bricks",
    pricePerUnit: 9.5,
    moq: 5000,
    strength: "15 - 20 N/mm²",
    dimensions: "190 x 90 x 90 mm",
    stockStatus: "In Stock",
    imageUrl: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=600&q=80",
    description: "High-density machine-cut red clay bricks fired in Hoffman continuous kilns.",
  },
  {
    name: "High-Density Fly Ash Bricks",
    category: "Eco Bricks",
    pricePerUnit: 7.2,
    moq: 10000,
    strength: "10 - 12 N/mm²",
    dimensions: "230 x 110 x 70 mm",
    stockStatus: "In Stock",
    imageUrl: "https://images.unsplash.com/photo-1584463699042-4b200b3e512d?auto=format&fit=crop&w=600&q=80",
    description: "Uniform dimensions with minimal plaster requirement. IS 12894 certified.",
  },
  {
    name: "Grade A Refractory Fire Bricks",
    category: "Industrial Refractory",
    pricePerUnit: 32.0,
    moq: 1000,
    strength: "35+ N/mm²",
    dimensions: "230 x 114 x 65 mm",
    stockStatus: "Made to Order",
    imageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f8?auto=format&fit=crop&w=600&q=80",
    description: "Thermal resistance up to 1400°C for furnaces, boilers, and industrial kilns.",
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB.");

    await Product.deleteMany({});
    await Product.insertMany(initialProducts);

    console.log("✅ Seeded initial products successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Failed:", err.message);
    process.exit(1);
  }
}

seed();