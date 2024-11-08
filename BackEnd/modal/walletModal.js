import mongoose from "mongoose";

const walletSchema = new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
        unique: true, 
      },
      transactions: [
        {
          description: { type: String, required: true },
          type: { type: String, required: true },
          amount: { type: Number, required: true },
          date: { type: Date, default: Date.now },
        },
      ],
    },
    { timestamps: true }
  );
  

export default mongoose.model("Wallet", walletSchema);
