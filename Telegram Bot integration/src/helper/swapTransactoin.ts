import { swapObject } from "../constant/functionParameterObject";
import { buySellMsgObject } from "../constant/telegramMessage";
import { tokenSymbolByAddress } from "../chains/linea/constant";
import {
  closeButton,
  swapTokenByWebAppButton,
} from "../bot/buttons/telegramMsgButton";
import { tokenInfo } from "../constant/tokenInfo";
import { CHAIN_NAME } from "../config/config";

// function return type TransactionBlock

export const swapTransaction = async (
  params: {
    coinTypeA: any;
    coinTypeB: any;
    amount: number;
  },
  chatBot: any,
  chatId: number,
  functionName: string,
  ctx: any
) => {
  try {
    ctx.session.trackObject.functionName = functionName;
    ctx.session.trackObject.functionParams = { ...params };
    ctx.session.trackObject.totalParams = swapObject.totalArguments;
    const msgObject = buySellMsgObject[ctx.session.isBuying ? "buy" : "sell"];
    const enterTextMsg = msgObject.inputText;
    console.log("swapTransaction...inside", params);
    if (!params.coinTypeA) {
      console.log("swapTransaction...A");
      ctx.session.trackObject.lastParamIndex = 0;
      ctx.api.sendMessage(chatId, "which coin you want to purchase. Enter token address", {
        reply_markup: {
          inline_keyboard: closeButton,
        },
        parse_mode: "HTML",
      });
      return "returning";
    }
    if (!params.coinTypeB) {
      console.log("swapTransaction...B");
      ctx.session.trackObject.lastParamIndex = 1;
      ctx.api.sendMessage(chatId, "from which coin you want to swap Enter token address", {
        reply_markup: {
          inline_keyboard: closeButton,
        },
        parse_mode: "HTML",
      });
      return "returning";
    }
    if (!params.amount) {
      console.log("swapTransaction...C");
      ctx.session.trackObject.lastParamIndex = 2;
      ctx.api.sendMessage(chatId, enterTextMsg, {
        reply_markup: {
          inline_keyboard: closeButton,
        },
        parse_mode: "HTML",
      });
      return "returning";
    }
    // if all paramsa we have reset the trackObject
    console.log("swapTransaction...all check passed");

    // updating function params in trackObject
    ctx.session.trackObject.functionParams = {
      amount: params.amount,
      fromTokenInfo: params.coinTypeB,
      toTokenInfo: params.coinTypeA,
    };

    let confirmationMsg = msgObject.confirmationMsg.replace(
      "{{tokenName}}",
      ctx.session.isBuying ? params.coinTypeA.symbol : params.coinTypeB.symbol
    );
    confirmationMsg = confirmationMsg.replace("{{amount}}", "" + params.amount);
    confirmationMsg = confirmationMsg.replace(
      "{{nativeTokenName}}",
      ctx.session.isBuying ? params.coinTypeB.symbol : params.coinTypeA.symbol
    );

    // send msg to user
    const message = await chatBot.api.sendMessage(chatId,confirmationMsg, {
      reply_markup: {
        inline_keyboard: swapTokenByWebAppButton,
      },
      parse_mode: "HTML",
    });
    ctx.session.lastMessageId = message.message_id;
    return "returning";
  } catch (error) {
    console.log("error in cetus......", error);
    if (JSON.stringify(error).includes("Insufficient balance")) {
      return "Insufficient balance";
    } else {
      return "Error in sending transaction";
    }
  }
};
