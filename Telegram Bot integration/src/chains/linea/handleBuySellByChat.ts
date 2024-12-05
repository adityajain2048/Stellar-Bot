import { bot } from "../..";
import { swapTransaction } from "../../helper/swapTransactoin";
import { nativeTokenInfo } from "./constant";
export const handleBuySellByChat = async (ctx: any, purpose: string) => {
  if (purpose === "buy") {
    const params = {
      coinTypeA: null,
      coinTypeB: nativeTokenInfo,
      amount: 0,
    };
    await swapTransaction(params, bot, ctx.chat.id, "swapTransaction", ctx);
  } else if (purpose === "sell") {
    const params = {
      coinTypeA: nativeTokenInfo,
      coinTypeB: null,
      amount: 0,
    };
    await swapTransaction(params, bot, ctx.chat.id, "swapTransaction", ctx);
  }
};
