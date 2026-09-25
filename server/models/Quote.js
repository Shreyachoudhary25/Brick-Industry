import mongoose from "mongoose";

const quoteSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    productName: { type: String, required: true },
    quantity: { type: String, required: true },
    deliverySite: { type: String, required: true },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Quote", quoteSchema);