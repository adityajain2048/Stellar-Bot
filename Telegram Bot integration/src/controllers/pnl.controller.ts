import { Request, Response } from "express";
import { getTokensPosition } from "../utils/getTokensPosition";
import { botInfo } from "../constant/botInfo";
import { CHAIN_NAME } from "../config/config";

export const WalletPnl = async (req: Request, res: Response) => {
  try {
    // extracting query params
    // const { tid } = req.query;
    // console.log("inside pnl controller....", tid);
    // const redisKey = `${
    //   botInfo[CHAIN_NAME as keyof typeof botInfo].botUsername
    // }:${tid}`;
    // const client = new redis(REDIS_URL);
    // const redisValue = await client.get(redisKey);
    // const userContext = JSON.parse(redisValue as string);
    // const walletAddress = userContext.smartAccountAddress;
    // const assetsDataArray = await getTokensPosition(walletAddress);
    // const pnlArray = [];
    // for (let i = 0; i < assetsDataArray?.length; i++) {
    //   const asset = assetsDataArray[i];
    //   pnlArray.push({
    //     name: asset?.symbol,
    //     imageUrl: asset?.logoURI,
    //     avgPrice: asset?.avgPrice,
    //     investedAmountInUsd: asset?.initialAmountInUSD,
    //     investedAmountInMatic: asset?.initialAmountInUSD / asset?.nativePrice,
    //     currentValueInUsd: asset?.currentAmountInUSD,
    //     currentValueInMatic: asset?.currentAmountInNative,
    //     profitLossInUsd: asset?.pnlInUSD,
    //     profitLossInMatic: asset?.pnlInNative,
    //     profitLossPercentage: asset?.pnlPercentage,
    //     value: asset?.availableAmount,
    //   });
    // }
    // res.send(pnlArray);
    res.send([]);
  } catch (error) {
    console.log("Error in WalletPnl", error);
  }
};
