import mongoose from "mongoose";

const offerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  discount: { type: Number, required: true }, // Percentage discount, e.g., 20 for 20%
  type: { type: String, enum: ["product", "category"], required: true }, 
  productsIncluded: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }], 
  categoryIncluded: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }], 
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: false },
});

export default mongoose.model("Offer", offerSchema);
