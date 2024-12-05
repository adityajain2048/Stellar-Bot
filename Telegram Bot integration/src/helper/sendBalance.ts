import {
  closeButton,
  transferNativeTokenButton,
} from "../bot/buttons/telegramMsgButton";
import { sendObject } from "../constant/functionParameterObject";

export const sendBalance = async (
  params: {
    amount: number;
    receiverAddress: string;
  },
  chatBot: any,
  chatId: number,
  functionName: string,
  ctx: any
) => {
  try {
    ctx.session.trackObject.functionName = functionName;
    ctx.session.trackObject.functionParams = { ...params };
    ctx.session.trackObject.totalParams = sendObject.totalArguments;
    console.log("sendBalance...inside", params);

    if (!params.amount) {
      console.log("sendBalance...A");
      ctx.session.trackObject.lastParamIndex = 0;
      ctx.api.sendMessage(chatId, `Enter <b>amount</b>`, {
        reply_markup: {
          inline_keyboard: closeButton,
        },
        parse_mode: "HTML",
      });
      return "returning";
    }

    if (!params.receiverAddress) {
      console.log("sendBalance...B");
      ctx.session.trackObject.lastParamIndex = 1;
      ctx.api.sendMessage(chatId, "submit receiver address", {
        reply_markup: {
          inline_keyboard: closeButton,
        },
        parse_mode: "HTML",
      });
      return "returning";
    }

    // if all paramsa we have reset the trackObject
    console.log("sendBalance...all check passed");
    const transactionSummary = `Widrawal of ${params.amount} amount to address <code>${params.receiverAddress}</code>.\n Please confirm transaction`;
    ctx.api.sendMessage(chatId, transactionSummary, {
      reply_markup: {
        inline_keyboard: transferNativeTokenButton,
      },
      parse_mode: "HTML",
    });
    return "returning";
  } catch (error) {
    console.log("error in sendBalance data collection......", error);
    return "error in sending transactoin....";
  }
};
