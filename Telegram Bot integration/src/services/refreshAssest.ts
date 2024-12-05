import { getERC20TokenBalance } from "../chains/linea/getERC20TokenBalance";
import { CHAIN_NAME } from "../config/config";
import { botInfo } from "../constant/botInfo";
import { getWalletBalance } from "../helper/getWalletBalance";
import { getTokenModel } from "../models/tokenSchema";
import { getUserModel } from "../models/userSchema";
import { redisInstance } from "../config/redis";
export const refreshAssest = async (walletAddress: string, ctx: any) => {
  try {
    const userModel = getUserModel(CHAIN_NAME);
    const tokenModel = getTokenModel(CHAIN_NAME);
    if (!walletAddress) return console.log("walletAddress is not available");
    // getting wallet balance
    const nativeBalance = await getWalletBalance(walletAddress);
    const assetsArray = [];
    const erc20Data = await getERC20TokenBalance(walletAddress);
    const tokenBalance = erc20Data?.items;
    
    const userInfo = await userModel.findOne({
      walletAddress: walletAddress,
    });
    if (userInfo) {
      const assets = userInfo?.assets;
      for (let i = 0; i < tokenBalance?.length; i++) {
        const tokenBalanceInfo = tokenBalance[i];
        // fetch tokenInformation from database
        const tokenInfo = await tokenModel.findOne({
          address: tokenBalanceInfo?.contract_address?.toLowerCase(),
        });
        const currentPrice = tokenInfo?.price || 0;
        let availableAsset = null;
        for (let j = 0; j < assets.length; j++) {
          if (tokenBalanceInfo.contract_address === assets[j]?.address) {
            availableAsset = assets[j];
            break;
          }
        }

        // if availableAsset is not available then add new asset
        if (availableAsset === null) {
          assetsArray.push({
            name: tokenBalanceInfo.contract_name,
            symbol: tokenBalanceInfo.contract_ticker_symbol,
            avgPrice: currentPrice ?? 0,
            availableAmount:
              Number(tokenBalanceInfo.balance?.toString() || "0") /
              10 ** tokenBalanceInfo.contract_decimals,
            address: tokenBalanceInfo?.contract_address?.toLowerCase(),
          });
        } else {
          // if availableAsset is available then update avgPrice and availableAmount
          const currentTokenValue =
            Number(tokenBalanceInfo.balance?.toString() || "0") /
            10 ** tokenBalanceInfo.contract_decimals;
          if (availableAsset.availableAmount < currentTokenValue) {
            const addedAmount =
              currentTokenValue - availableAsset.availableAmount;
            availableAsset.avgPrice =
              (availableAsset.avgPrice * availableAsset.availableAmount +
                addedAmount * (currentPrice || 0)) /
              currentTokenValue;
          }
          availableAsset.availableAmount = currentTokenValue;
          assetsArray.push(availableAsset);
        }
        await userModel.findOneAndUpdate(
          { walletAddress: walletAddress },
          { assets: assetsArray }
        );
      }
      // update the balance in redis
      const redisKey = `${
        botInfo[CHAIN_NAME as keyof typeof botInfo].botUsername
      }:${ctx.chat.id}`;
      const redisValue = await redisInstance.get(redisKey);
      const userContext = JSON.parse(redisValue as string) ?? {};
      userContext.assets = assetsArray;
      userContext.nativeTokenBalance = Number(nativeBalance);
      ctx.session.nativeTokenBalance = Number(nativeBalance);
      redisInstance.set(redisKey, JSON.stringify(userContext));
    }
  } catch (error) {
    console.log("error in refreshAssest: ", error);
  }
};
