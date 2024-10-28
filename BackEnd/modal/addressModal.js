import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  username: { type: String, required: true },
  street: { type: String, required: true },
  village: { type: String },
  town: { type: String },
  postcode: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String },
  phonenumber: { type: String, required: true },
  defaultAddress: {
    type: Boolean,
    default: false,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.model("address", addressSchema);
