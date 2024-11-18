import mongoose from "mongoose";

const offerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  associatedFor: { type: String, enum: ["product", "category"], required: true }, 
  offerPrice: { type: Number, required: true }, 
  productsIncluded: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }], 
  categoryIncluded: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: false },
});

export default mongoose.model("Offer", offerSchema);
