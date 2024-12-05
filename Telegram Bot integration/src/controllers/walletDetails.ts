import { Request, Response } from "express";
import { getWalletBalance } from "../helper/getWalletBalance";
import { getERCTokens } from "../helper/getERCTokens";
import { CHAIN_NAME } from "../config/config";
import { botInfo } from "../constant/botInfo";
import { redisInstance } from "../config/redis";

export const WalletDetails = async (req: Request, res: Response) => {
  // extracting the tid from the query params
  const { tid } = req.query;
  console.log("inside wallet details controller....", tid);
  const chatId = Number(tid);
  const redisKey = `${
    botInfo[CHAIN_NAME as keyof typeof botInfo].botUsername
  }:${chatId}`;
  const redisValue = await redisInstance.get(redisKey);
  const userContext = JSON.parse(redisValue as string);
  const walletAddress = userContext.smartAccountAddress;
  const walletBalance = await getWalletBalance(walletAddress);
  // const gibBalance = await getERCTokens(saAddress);
  const walletObject = { walletAddress: "", nativeBalane: 0, nativeToken: "" };
  walletObject["walletAddress"] = walletAddress;
  walletObject["nativeBalane"] = Number(walletBalance);
  walletObject["nativeToken"] =
    botInfo[CHAIN_NAME as keyof typeof botInfo].nativeToken;
  // walletObject["maticBalance"] = walletBalance;
  // walletObject["gibBalance"] = gibBalance;
  res.send(walletObject);
};
