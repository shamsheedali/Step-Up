import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.googleID;
      },
    },
    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
    },
    googleID: {
      type: String,
      default: null,
      // unique: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    profileImage: { type: String },
    resetPasswordCode: { type: String },
    resetPasswordExpiry: { type: Date },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("users", userSchema);
