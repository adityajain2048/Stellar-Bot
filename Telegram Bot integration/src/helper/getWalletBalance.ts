import { ethers } from "ethers";
import { CHAIN_NAME } from "../config/config";
import { botInfo } from "../constant/botInfo";
export const getWalletBalance = async (walletAddress: string) => {
  try {
    const provider = new ethers.JsonRpcProvider(botInfo[CHAIN_NAME as keyof typeof botInfo].RPC_URL);
    const maticBalance = await provider.getBalance(walletAddress);
    const maticBalanceIn5Place = parseFloat(
      ethers.formatEther(maticBalance)
    ).toFixed(5);
    return maticBalanceIn5Place;
  } catch (error) {
    return "error in getting wallet balance";
  }
};
