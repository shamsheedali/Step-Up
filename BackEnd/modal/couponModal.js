import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  description: { type: String },
  minimumPurchase: { type: Number, default: 0 },
  discountPercentage: { type: Number, required: true },
  maxDiscount: { type: Number, default: 0 },
  expiryDate: { type: Date, required: true },
  usageLimit: { type: Number, default: null },
  usedCount: { type: Number, default: 0 },
  status: { type: Boolean, default: true },
  usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
});

export default mongoose.model("Coupon", couponSchema);