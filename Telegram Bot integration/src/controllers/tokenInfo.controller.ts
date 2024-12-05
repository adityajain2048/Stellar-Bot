import { CHAIN_NAME } from "../config/config";
import { botInfo } from "../constant/botInfo";
import { getTokenModel } from "../models/tokenSchema";
import { Request, Response } from "express";
import { getUserModel } from "../models/userSchema";
import { redisInstance } from "../config/redis";

export const TokenInfo = async (req: Request, res: Response) => {
  try {
    const { tid } = req.query;
    const chatId = Number(tid);
    const redisKey = `${
      botInfo[CHAIN_NAME as keyof typeof botInfo].botUsername
    }:${chatId}`;
    const tokens = [];
    // const client = new redis(REDIS_URL);
    const redisValue = await redisInstance.get(redisKey);

    const userContext = JSON.parse(redisValue as string);

    const walletAddress = userContext?.smartAccountAddress;
    const tokenModel = getTokenModel(CHAIN_NAME);
    const userModel = getUserModel(CHAIN_NAME);
    const userInfo = await userModel.findOne({
      walletAddress: walletAddress,
    });
    const assets = userInfo?.assets || [];

    const tokenInfo = await tokenModel.find();
    for (let i = 0; i < tokenInfo.length; i++) {
      const token = tokenInfo[i];
      let balance = 0;
      for (let j = 0; j < assets?.length; j++) {
        const asset = assets[j];
        if (
          asset.address?.toLocaleLowerCase() ===
          token.address?.toLocaleLowerCase()
        ) {
          balance = asset.availableAmount;
        }
      }
      tokens.push({
        name: token.name,
        balance: balance?.toFixed(6) || 0,
        address: token.address,
        price: token.price,
        decimal: token.decimal,
        symbol: token.symbol,
        logoURI: token.logoURI,
        isRecommended: token.isRecommended,
        coinGeckoId: token.coinGeckoId,
      });
    }
    res.send(JSON.stringify(tokens));
  } catch (error) {
    console.log("Error in getting token info..............", error);
    res.send("error in fetching token information...");
  }
};
