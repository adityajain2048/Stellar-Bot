import { ethers } from "ethers";
import { closeButton } from "../bot/buttons/telegramMsgButton";
import { getTokenBalance } from "../chains/linea/getTokenBalance";
import { CHAIN_NAME } from "../config/config";
import { botInfo } from "../constant/botInfo";
import { swapKeysObject } from "../constant/functionParameterObject";
import { notEnoughBalance } from "../constant/telegramMessage";
import { getTokenApiCall } from "../chains/linea/getTokenApiCall";

export const validateMessage = async (text: any, ctx: any) => {
  try {
    let data = null;
    // amount verification
    if (
      swapKeysObject[
        ctx.session.trackObject.lastParamIndex as keyof typeof swapKeysObject
      ] === "amount"
    ) {
      let balanceValidationMsg = notEnoughBalance.replace(
        "{{walletAddress}}",
        ctx.session.smartAccountAddress
      );
      // validation if enter amount is number
      if (isNaN(text)) {
        ctx.reply(
          "Invalid input. Please try correct input. amount should be in number "
        );
        return "returning";
      }

      let tokenBalance: any = 0;
      // getting token balance of the user

      const walletAddress = ctx.session.smartAccountAddress;

      if (ctx.session.isBuying) {
        // getting native token balance
        const tokenAddress =
          botInfo[CHAIN_NAME as keyof typeof botInfo].nativeTokenAddress;
        tokenBalance = await getTokenBalance(walletAddress, tokenAddress, ctx);
        data = Number(text);
      } else {
        // getting selected token balance
        const tokenAddress = ctx.session.selectedTokenInfo.address;
        tokenBalance = await getTokenBalance(walletAddress, tokenAddress, ctx);
      }
      // if isBuying is false then amount will be in percentage
      if (!ctx.session.isBuying) {
        // checking percentage should be <=100 and >0
        if (parseFloat(text) > 100 || parseFloat(text) <= 0) {
          ctx.reply(
            "Invalid input. Please try correct input. Enter percentage between 0 to 100."
          );
          return "returning";
        }

        balanceValidationMsg = `😕 Uh-oh! It looks like there might be a problem.
        
                🔍 Insufficient Token Balance It seems you don't have enough tokens to complete this sale. Please check your balance and try again.`;
        data = (Number(tokenBalance) * parseFloat(text)) / 100;
      }
      // token balance should be greater than 0
      if (Number(tokenBalance) < data) {
        ctx.reply(balanceValidationMsg, {
          reply_markup: {
            inline_keyboard: closeButton,
          },
          parse_mode: "HTML",
        });
        return "returning";
      }
    }
    // address validation
    else if (
      swapKeysObject[
        ctx.session.trackObject.lastParamIndex as keyof typeof swapKeysObject
      ] === "coinTypeA" ||
      "coinTypeB"
    ) {
      if (!ethers.isAddress(text)) {
        console.log("check is address...");
        ctx.reply(
          "Invalid input. Please try with correct address, address starts with 0x"
        );
        return "returning";
      }

      const response = await getTokenApiCall(text);
      // if information is not available on geckoterminal
      if (response.data.length === 0) {
        await ctx.api.sendMessage(
          ctx.chat.id,
          "Token information is not available..",
          {
            reply_markup: {
              inline_keyboard: closeButton,
            },
            parse_mode: "HTML",
          }
        );
        return "returning";
      }
      const coinInfo = response?.data[0]?.attributes;
      data = {
        name: coinInfo.name,
        symbol: coinInfo.symbol,
        address: coinInfo.address,
        price: -1,
        decimal: coinInfo.decimals,
        logoURI: coinInfo.image_url,
        coinGeckoId: "",
        isRecommended: false,
      };
      ctx.session.selectedTokenInfo = data;
    }
    return data;
  } catch (error) {
    console.log("Error in validateMessage", error);
    return "returning";
  }
};
