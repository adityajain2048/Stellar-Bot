import axios from "axios";
import sharp from "sharp";

import { getUserModel } from "../../models/userSchema";
import { CHAIN_NAME } from "../../config/config";
import {
  closeButton,
  selectedTokenButton,
} from "../../bot/buttons/telegramMsgButton";
import { tokenInfo } from "../../constant/tokenInfo";
import { botInfo } from "../../constant/botInfo";
import { bot } from "../..";
import { getTokensPosition } from "../../utils/getTokensPosition";
import { getWalletBalance } from "../../helper/getWalletBalance";
import { redisInstance } from "../../config/redis";
import { getTokenModel } from "../../models/tokenSchema";
import { getTokenApiCall } from "./getTokenApiCall";
import { largeDataFormator } from "../../utils/largeDataFormator";
export const getTokenInformation = async (tokenAddress: string, ctx: any) => {
  try {
    ctx.session.selectedTokenAddress = tokenAddress;
    const tokenModel = getTokenModel(CHAIN_NAME);
    const walletAddress = ctx.session.smartAccountAddress;
    const message = await bot.api.sendMessage(
      ctx.chat.id,
      "Fetching token information.."
    );
    // ctx.session.lastMessageId = message.message_id;
    let messageId = message.message_id;

    const response = await getTokenApiCall(tokenAddress);
    
    // if information is not available on geckoterminal
    
    if (response.data.length === 0) {
      await ctx.api.editMessageText(
        ctx.chat.id,
        messageId,
        "Token information is not available..",
        {
          reply_markup: {
            inline_keyboard: closeButton,
          },
          parse_mode: "HTML",
        }
      );
      return;
    }

    // const nativeBalance = ctx.session.nativeTokenBalance;
    // console.log("nativeBalance...", nativeBalance);
    const nativeBalance = await getWalletBalance(walletAddress);
    const positionArray = await getTokensPosition(walletAddress, ctx);
    const tokensFromRedis = JSON.parse(await redisInstance.get(CHAIN_NAME));
    let _5m = 0;
    let _1h = 0;
    let _6h = 0;
    let _24h = 0;

    const tokenPriceChangeMCap =
      tokensFromRedis[tokenAddress?.toLocaleLowerCase()];
    if (tokenPriceChangeMCap) {
      _5m =
        ((Number(tokenPriceChangeMCap?.price) -
          Number(tokenPriceChangeMCap["5m"]?.price)) *
          100) /
        Number(tokenPriceChangeMCap["5m"]?.price);
      _1h =
        ((Number(tokenPriceChangeMCap?.price) -
          Number(tokenPriceChangeMCap["1h"]?.price)) *
          100) /
        Number(tokenPriceChangeMCap["1h"]?.price);
      _6h =
        ((Number(tokenPriceChangeMCap?.price) -
          Number(tokenPriceChangeMCap["6h"]?.price)) *
          100) /
        Number(tokenPriceChangeMCap["6h"]?.price);
      _24h =
        ((Number(tokenPriceChangeMCap?.price) -
          Number(tokenPriceChangeMCap["24h"]?.price)) *
          100) /
        Number(tokenPriceChangeMCap["24h"]?.price);
    }
    let tokenObject: any = null;
    for (let i = 0; i < positionArray?.length; i++) {
      if (
        positionArray[i]?.address?.toLocaleLowerCase() ===
        tokenAddress?.toLowerCase()
        
      ) {
        tokenObject = positionArray[i];
        // console.log(tokenObject)

        break;
      }
    }
    const coinInfo = response?.data[0]?.attributes;
    // console.log("coinInfo....", coinInfo);
    // saving token information in redis

    const selectedToken = {
      name: coinInfo.name,
      symbol: coinInfo.symbol,
      address: coinInfo.address,
      price: -1,
      decimal: coinInfo.decimals,
      logoURI: coinInfo.image_url,
      coinGeckoId: "",
      isRecommended: false,
    };

    let coinInfoMessage = `🔹 ${coinInfo.name} | ${coinInfo.symbol} | <code>${
      coinInfo.address
    }</code>\n\nCurrent Balance: ${
      tokenObject ? tokenObject.availableAmount : 0
    } ${coinInfo.name}\nPrice:$${coinInfo.price_usd}\n\n5m:${_5m?.toFixed(
      2
    )}%, 1h:${_1h?.toFixed(2)}%, 6h:${_6h?.toFixed(2)}% 24h:${_24h?.toFixed(
      2
    )}%\n${
      coinInfo?.market_cap_usd ? "Market Cap: $"+largeDataFormator(coinInfo?.market_cap_usd) : "FDV: $"+largeDataFormator(coinInfo?.fdv_usd)
    }\n24h Trading Volume: $${Number(coinInfo.volume_usd?.h24)?.toFixed(
      6
    )}\n\nWallet Balance: ${nativeBalance} ${
      botInfo[CHAIN_NAME as keyof typeof botInfo].nativeToken
    }\nTo trade press one of the buttons below`;

    const updatedSelectedTokenButton = [
      ...selectedTokenButton,
      [
        {
          text: "🔍 Screener",
          url: `${
            botInfo[CHAIN_NAME as any].dexScreenerUrl
          }/${tokenAddress}`,
        },
        { text: "🚀 Transfer", callback_data: "transferToken" },
        { text: "❌ Close", callback_data: "cancel" },
      ],
    ];
    // ctx.api.sendMessage(ctx.chat.id, coinInfoMessage, {
    //   reply_markup: {
    //     inline_keyboard: updatedSelectedTokenButton,
    //   },
    //   parse_mode: "HTML",
    // });

    await ctx.api.editMessageText(ctx.chat.id, messageId, coinInfoMessage, {
      reply_markup: {
        inline_keyboard: updatedSelectedTokenButton,
      },
      parse_mode: "HTML",
    });

    // tokenInfo in redis
    const redisKey = `${
      botInfo[CHAIN_NAME as keyof typeof botInfo].botUsername
    }:${ctx.chat.id}`;
    const redisValue = await redisInstance.get(redisKey);
    const userContext = JSON.parse(redisValue as string);
    userContext.selectedTokenInfo = selectedToken;
    ctx.session.selectedTokenInfo = selectedToken;
    redisInstance.set(redisKey, JSON.stringify(userContext));

    // saving token information in mongodb
    // findding token in db by address
    const tokenInDb = await tokenModel.findOne({address: tokenAddress?.toLocaleLowerCase()});
    // save in db if not present
    if (!tokenInDb) {
      const token = new tokenModel({
        name: coinInfo.name,
        symbol: coinInfo.symbol,
        address: coinInfo.address,
        price: coinInfo.  price_usd,
        decimal: coinInfo.decimals,
        logoURI: coinInfo.image_url,
        coinGeckoId: "",
        isRecommended: false,
      });
      await token.save();
    }
  } catch (error) {
    console.log("Error in getTokenInformation..", error);
    ctx.api.sendMessage(ctx.chat.id, "Error in getting token information..");
  }
};
