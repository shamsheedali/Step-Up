import mongoose from "mongoose";

// Variant schema
const variantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  size: [String],
  color: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  images: [
    {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
  ],
  isDeleted: { type: Boolean, default: false },
});

// Product schema
const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    sizes: [
      {
        name: { type: String, required: true },
        inStock: { type: Boolean, default: false },
      },
    ],
    newArrival: {
      type: Boolean,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    stock: {
      type: Number,
      required: true,
    },
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],
    variants: [variantSchema],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
