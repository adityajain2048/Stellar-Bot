import { Request, Response } from "express";
import { bot } from "..";
import { botInfo } from "../constant/botInfo";
import { CHAIN_NAME } from "../config/config";
import { swapTokenByWebAppButton } from "../bot/buttons/telegramMsgButton";
import { redisInstance } from "../config/redis";
export const SwapToken = async (req: Request, res: Response) => {
  try {
    const { tid } = req.query;
    const { body } = req.body;

    const { fromTokenInfo, toTokenInfo, amount } = JSON.parse(body);
    console.log("swapToken controller..", fromTokenInfo, toTokenInfo, amount);
    // convert tid into number and get the user context
    const chatId = Number(tid);
    const redisKey = `${
      botInfo[CHAIN_NAME as keyof typeof botInfo].botUsername
    }:${chatId}`;
    const redisValue = await redisInstance.get(redisKey);
    const userContext = JSON.parse(redisValue as string);
    userContext.trackObject.functionName = "swapTransactionByWebapp";
    userContext.trackObject.functionParams = {
      amount: amount,
      fromTokenInfo: fromTokenInfo,
      toTokenInfo: toTokenInfo,
    };
    const transactionSummary = `Buying ${toTokenInfo.name} for ${amount} ${fromTokenInfo.name}\n Please confirm transaction`;
    bot.api.sendMessage(chatId, transactionSummary, {
      reply_markup: {
        inline_keyboard: swapTokenByWebAppButton,
      },
      parse_mode: "HTML",
    });

    const userContextInString = JSON.stringify(userContext);
    // update user context in redis
    await redisInstance.set(redisKey, userContextInString);
    res.send("Swap Controller...");
  } catch (error) {
    console.log("Error in Swap controller....", error);
    res.send("Error in Swap token....");
  }
};
