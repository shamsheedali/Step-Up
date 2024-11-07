  import mongoose from "mongoose";

  const orderSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        price : {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed", "Refunded"],
      default: "Pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cashOnDelivery", "razorPay", "Wallet"],
      required: true,
    },
    shippingAddress: {
      username: String,
      street: String,
      village: String,
      town: String,
      postcode: String,
      phonenumber: Number,
    },
    status: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },
    placedAt: {
      type: Date,
      default: Date.now,
    },
    discountApplied: { type: Number, default: 0 },
  }, {
      timestamps: true,
  });

  const Order = mongoose.model("Order", orderSchema);
  export default Order;