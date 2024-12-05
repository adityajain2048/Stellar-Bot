import { ethers } from "ethers";
import { COVALENT_API_KEY } from "../../config/config";
import { CovalentClient } from "@covalenthq/client-sdk";

export const getERC20TokenBalance = async (walletAddress: string) => {
  try {
    const apiKey = COVALENT_API_KEY || "";
    const client = new CovalentClient(apiKey);
    const resp = await client.BalanceService.getTokenBalancesForWalletAddress(
      "linea-mainnet",
      walletAddress
    );
    return resp.data;
  } catch (error) {
    console.log("Error in getERC20TokenBalance.......", error);
    return {items: []};
  }
};
