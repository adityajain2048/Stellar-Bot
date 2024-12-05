import { ethers } from "ethers";
import { getUserModel } from "../../models/userSchema";
import { CHAIN_NAME } from "../../config/config";

export const getTokenBalance = async (
  walletAddress: string,
  tokenAddress: string,
  ctx: any
) => {
  console.log("inside get token balance....", walletAddress, tokenAddress);
  try {
   
    // getting token balance of this token address of this wallet address
    const userModel = await getUserModel(CHAIN_NAME);
    const userInfo = await userModel.findOne({ walletAddress: walletAddress });
    const walletAssets = userInfo?.assets ?? [];
    // finding token balance of this token address
    let tokenBalance = 0;
    for (let i = 0; i < walletAssets.length; i++) {
      if (
        walletAssets[i]?.address?.toLocaleLowerCase() ===
        tokenAddress?.toLowerCase()
      ) {
        tokenBalance = walletAssets[i]?.availableAmount ?? 0;
        break;
      }
    }
    return tokenBalance.toFixed(4);
  } catch (error) {
    console.log("Error in getting token balance..............", error);
    return 0;
  }
};
