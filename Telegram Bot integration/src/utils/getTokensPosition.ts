import { CHAIN_NAME } from "../config/config";
import { botInfo } from "../constant/botInfo";
import { getTokenModel } from "../models/tokenSchema";
import { getUserModel } from "../models/userSchema";
import { IPositionToken } from "../interface/tokenInfo.interface";
import { redisInstance } from "../config/redis";

export const getTokensPosition = async (walletAddress: string, ctx: any) => {
  try {
    // const userModel = getUserModel(CHAIN_NAME);
    // const tokenModel = getTokenModel(CHAIN_NAME);
    const assets = ctx.session.assets;
    if (!assets) {
      return [];
    }
    // const userInfo = await userModel.findOne({
    //   walletAddress: walletAddress,
    // });
    // const assets = userInfo?.assets;
    const tokensPositionArray = [];
    const tokensFromRedis = JSON.parse(await redisInstance.get(CHAIN_NAME));
    const nativeTokenAddress =
      botInfo[CHAIN_NAME as keyof typeof botInfo].nativeTokenAddress;
    const nativeTokenPriceInfo = tokensFromRedis[nativeTokenAddress];
    const nativeTokenPrice = Number(nativeTokenPriceInfo.price);
    // const nativeInfo = await tokenModel.findOne({
    //   address: botInfo[CHAIN_NAME as keyof typeof botInfo].nativeTokenAddress,
    // });
    for (let i = 0; assets && i < assets?.length; i++) {
      const tokenObject: IPositionToken = {} as IPositionToken;
      const asset = assets[i];
      // const tokenInfo = await tokenModel.findOne({
      //   address: asset.address,
      // });
      const tokenPriceInfo = tokensFromRedis[asset.address];
      const tokenCurrentPrice = tokenPriceInfo?.price;
      const marketCap = tokenPriceInfo?.marketCap;
      const fdv = tokenPriceInfo?.fdv;
      // if available amount is null or undefined then it will be 0
      const availableAmount = asset.availableAmount || 0;
      tokenObject["nativePrice"] = nativeTokenPrice || -1;
      tokenObject["symbol"] = asset.symbol;
      tokenObject["address"] = asset.address;
      tokenObject["availableAmount"] = availableAmount;
      tokenObject["avgPrice"] = asset.avgPrice ?? 0;
      tokenObject["currentPrice"] = tokenCurrentPrice || -1;
      tokenObject["logoURI"] = "";
      tokenObject["initialAmountInUSD"] = Number(
        (asset.avgPrice * availableAmount)?.toFixed(5)
      );
      tokenObject["currentAmountInUSD"] = Number(
        (tokenCurrentPrice * availableAmount)?.toFixed(5)
      );
      tokenObject["currentAmountInNative"] = Number(
        nativeTokenPrice == 0
          ? 0.0
          : (
              tokenObject["currentAmountInUSD"] / (nativeTokenPrice)
            )?.toFixed(5)
      );
      tokenObject["pnlInUSD"] =
        tokenObject["currentAmountInUSD"] - tokenObject["initialAmountInUSD"];
      tokenObject["pnlInUSD2Place"] = Number(
        tokenObject["pnlInUSD"]?.toFixed(5)
      );
      tokenObject["pnlPercentage"] = Number(
        tokenObject["initialAmountInUSD"] === 0
          ? 0.0
          : (
              (tokenObject["pnlInUSD"] / tokenObject["initialAmountInUSD"]) *
              100
            )?.toFixed(2)
      );
      tokenObject["pnlInNative"] = Number(
        nativeTokenPrice == 0
          ? 0.0
          : (tokenObject["pnlInUSD"] / (nativeTokenPrice || 1))?.toFixed(5)
      );
      if(tokenPriceInfo){
        tokenObject["marketCap"] = marketCap;
        tokenObject["fdv"] = fdv;
        tokenObject["5m"] = (tokenCurrentPrice-Number(tokenPriceInfo["5m"]?.price))/Number(tokenPriceInfo["5m"]?.price)*100;
        tokenObject["1h"] = (tokenCurrentPrice-Number(tokenPriceInfo["1h"]?.price))/Number(tokenPriceInfo["1h"]?.price)*100;
        tokenObject["6h"] = (tokenCurrentPrice-Number(tokenPriceInfo["6h"]?.price))/Number(tokenPriceInfo["6h"]?.price)*100;
        tokenObject["24h"] = (tokenCurrentPrice-Number(tokenPriceInfo["24h"]?.price))/Number(tokenPriceInfo["24h"]?.price)*100;
      }else{
        tokenObject["marketCap"] = null;
        tokenObject["fdv"] = null;
        tokenObject["5m"] = 0;
        tokenObject["1h"] = 0;
        tokenObject["6h"] = 0;
        tokenObject["24h"] = 0;
      }
      tokensPositionArray.push(tokenObject);
    }

    return tokensPositionArray;
  } catch (error) {
    console.log("Error in getting tokens position", error);
    return [];
  }
};
