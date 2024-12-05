import { Request, Response } from "express";
import { bot } from "..";
import { botInfo } from "../constant/botInfo";
import { CHAIN_NAME } from "../config/config";
import { transferTokenByWebAppButton } from "../bot/buttons/telegramMsgButton";
import { redisInstance } from "../config/redis";
// import { confirmationButton } from "../constants/telegramMsgButton";

export const TransferToken = async (req: Request, res: Response) => {
  console.log("buyToken controller..");
  // extract the tid from the request
  const { tid } = req.query;
  const { body } = req.body;

  const { tokenInfo, amount, receiverAddress } = JSON.parse(body);
  // convert tid into number and get the user context
  const chatId = Number(tid);
  // access data from redis
  const redisKey = `${
    botInfo[CHAIN_NAME as keyof typeof botInfo].botUsername
  }:${chatId}`;
  const redisValue = await redisInstance.get(redisKey);

  const userContext = JSON.parse(redisValue as string);
  userContext.tranferTokenName = tokenInfo.name;
  userContext.isBuying = true;
  userContext.trackObject.functionName = "transferTokenByWebApp";
  userContext.trackObject.functionParams = {
    amount,
    receiverAddress,
    tokenAddress: tokenInfo?.address,
  };
  const transactionSummary = `Transferring of ${amount} ${tokenInfo.name} amount to address <code>${receiverAddress}</code>.\n Please confirm transaction`;

  const userContextInString = JSON.stringify(userContext);
  // update user context in redis
  const result = await redisInstance.set(redisKey, userContextInString);
  console.log("redis userContex updated...", result);
  bot.api.sendMessage(chatId, transactionSummary, {
    reply_markup: {
      inline_keyboard: transferTokenByWebAppButton,
    },
    parse_mode: "HTML",
  });
  res.send("Buy Controller...");
};
