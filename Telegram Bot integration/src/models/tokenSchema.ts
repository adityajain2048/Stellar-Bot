import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
  address: { type: String, required: true },
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  price: { type: Number, required: true },
  decimal: { type: Number, required: true },
  logoURI: { type: String, required: true },
  coinGeckoId: { type: String },
  isRecommended: { type: Boolean, required: true },
});
export const getTokenModel = (chainName: string) => {
  return mongoose.model(`${chainName}Token`, tokenSchema);
};
