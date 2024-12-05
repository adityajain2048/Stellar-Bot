import { CHAIN_NAME } from "../../config/config";
import { getUserModel } from "../../models/userSchema";
import { swapToken } from "./swapToken";

export const swapTokenByWebApp = async (
  amount: number,
  fromTokenInfo: any,
  toTokenInfo: any,
  walletAddress: string,
  chatId: number,
  ctx: any
) => {
  const userModel = getUserModel(CHAIN_NAME);
  const userInfo = await userModel.findOne({
    walletAddress: walletAddress,
  });
  const referredBy = userInfo?.referredBy;
  const referralAddress = referredBy === "own" ? "" : referredBy || ""; // Provide a default value for referralAddress
  await swapToken(chatId, fromTokenInfo, toTokenInfo, amount, referralAddress,ctx);
};
