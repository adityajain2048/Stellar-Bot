import { ethers } from "ethers";
import { bot } from "../..";
import { getTokenBalance } from "../../chains/linea/getTokenBalance";
import {
  sendKeysObject,
  singInObject,
  swapKeysObject,
} from "../../constant/functionParameterObject";
import { getERCTokens } from "../../helper/getERCTokens";
import { handleSignIn } from "../../helper/handleSignIn";
import { sendBalance } from "../../helper/sendBalance";
import { swapTransaction } from "../../helper/swapTransactoin";
import { getTokenInformation } from "../../chains/linea/getTokenInformation";
import { botInfo } from "../../constant/botInfo";
import { CHAIN_NAME } from "../../config/config";
import { notEnoughBalance } from "../../constant/telegramMessage";
import { closeButton } from "../buttons/telegramMsgButton";
import { symbolToAddress } from "../../chains/linea/constant";
import { parseMessage } from "../../utils/textRecognizer";
import { validateMessage } from "../../utils/validateMessage";
import { handleBuySellByChat } from "../../chains/linea/handleBuySellByChat";

export const handleMessage = async (ctx: any) => {
  const text = ctx.message.text;
  const functionName = ctx.session.trackObject.functionName;
  try {
    if (functionName === "" && ethers.isAddress(text)) {
      // got to coingecko get info , name,logo,market cap, price, with buy sell button.
      getTokenInformation(text, ctx);
    } else if (functionName === "" && text.startsWith("/buy_")) {
      const data = text;
      ctx.session.isBuying = true;
      // extracting token symbol from data by substring method
      const tokenSymbol = data.substring(data.indexOf("/buy_") + 5);
      const tokenAddress = symbolToAddress[tokenSymbol];
      await getTokenInformation(tokenAddress, ctx);
    } else if (functionName === "" && text.startsWith("/sell_")) {
      const data = text;
      ctx.session.isBuying = false;
      const tokenSymbol = data.substring(data.indexOf("/sell_") + 6);
      const tokenAddress = symbolToAddress[tokenSymbol];
      await getTokenInformation(tokenAddress, ctx);
    }
    // for sendBalance
    else if (functionName === "sendBalance") {
      if (
        ctx.session.trackObject.lastParamIndex <
        ctx.session.trackObject.totalParams
      ) {
        // checking amount as number
        if (
          sendKeysObject[
            ctx.session.trackObject
              .lastParamIndex as keyof typeof swapKeysObject
          ] === "amount" &&
          isNaN(text)
        ) {
          ctx.reply(
            "Invalid input. Please try correct input. amount should be in number "
          );
          return;
        }

        ctx.session.trackObject.functionParams[
          `${
            sendKeysObject[
              ctx.session.trackObject
                .lastParamIndex as keyof typeof sendKeysObject
            ]
          }`
        ] = text;
      } else {
        ctx.session.trackObject.lastParamIndex =
          ctx.session.trackObject.totalParams + 1;
      }
      await sendBalance(
        ctx.session.trackObject.functionParams,
        bot,
        ctx.chat.id,
        "sendBalance",
        ctx
      );
    } else if (functionName === "handleSignIn") {
      if (
        ctx.session.trackObject.lastParamIndex <
        ctx.session.trackObject.totalParams
      ) {
        ctx.session.trackObject.functionParams[
          `${
            singInObject[
              ctx.session.trackObject
                .lastParamIndex as keyof typeof singInObject
            ]
          }`
        ] = text;
      } else {
        ctx.session.trackObject.lastParamIndex =
          ctx.session.trackObject.totalParams + 1;
      }
      await handleSignIn(
        ctx.session.trackObject.functionParams,
        bot,
        ctx.chat.id,
        "handleSignIn",
        ctx
      );
    } else if (functionName === "swapTransaction") {
      if (
        ctx.session.trackObject.lastParamIndex <
        ctx.session.trackObject.totalParams
      ) {
        let data = await validateMessage(text, ctx);
        console.log("data....", data);
        if (data === "returning") return;
        console.log("lastParamIndex....", ctx.session.trackObject.lastParamIndex);
        ctx.session.trackObject.functionParams[
          `${
            swapKeysObject[
              ctx.session.trackObject
                .lastParamIndex as keyof typeof swapKeysObject
            ]
          }`
        ] = data;
      } else {
        ctx.session.trackObject.lastParamIndex =
          ctx.session.trackObject.totalParams + 1;
      }

      await swapTransaction(
        ctx.session.trackObject.functionParams,
        bot,
        ctx.chat.id,
        "swapTransaction",
        ctx
      );
    } else {
      const textMeaning = await parseMessage(text);
      // ctx.reply("Invalid input. Please try correct input.");
      // ctx.reply(`textMeaning....${JSON.stringify(textMeaning)}`);
      if (textMeaning.action === "undefined")
        ctx.reply("Invalid input. Please try correct input.");
      else {
        if (textMeaning.action === "buy") {
          ctx.session.isBuying = true;
          await handleBuySellByChat(ctx, "buy");
        } else if (textMeaning.action === "sell") {
          ctx.session.isBuying = false;
          await handleBuySellByChat(ctx, "sell");
        }
      }
    }
  } catch (error) {
    console.log("Error in handleMessage", error);
    ctx.api.sendMessage(ctx.chat.id, `Error: ${JSON.stringify(error)}`);
  }
};
