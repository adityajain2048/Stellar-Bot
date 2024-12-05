import { Request, Response } from "express";
import { bot } from "..";
import { swapTransaction } from "../helper/swapTransactoin";

export const Sell = async (req: Request, res: Response) => {
  // extract the tid from the request
  const { tid } = req.query;
  // convert tid into number and get the user context
  const chatId = Number(tid);
  // const userContext = userContexts.get(chatId);
  // userContext.isBuying = false;
  // await swapTransaction(
  //   {
  //     coinTypeA: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  //     coinTypeB: "0x3efcd659b7a45d14dda8a102836ce4b765c42324",
  //     amount: 0,
  //   },
  //   bot,
  //   chatId,
  //   "swapTransaction",
  //   userContext.keypairObject
  // );
  res.send("Sell Controller...");
};
