import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  walletAddress: { type: String, required: true },
  referredBy: { type: String, required: true, default: "own" },
  referralCount: { type: Number, required: true, default: 0 },
  referralEarned: { type: Number, required: true, default: 0 },
  assets: { type: Array, required: true },
  chatId: { type: Number, required: true },
  isSecured: { type: Boolean, required: true, default: false },
});

export const getUserModel = (chainName: string) => {
  return mongoose.model(`${chainName}User`, userSchema);
};
