import { closeButton } from "../../bot/buttons/telegramMsgButton";
import { CHAIN_NAME } from "../../config/config";
import { botInfo } from "../../constant/botInfo";
import { notEnoughBalance } from "../../constant/telegramMessage";
import { swapTransaction } from "../../helper/swapTransactoin";
import { handleSwapToken } from "./handleSwapToken";
import { bot } from "../..";
import { nativeTokenInfo } from "./constant";

export const handleTokenBuy = async (amount: number, ctx: any) => {
  const toTokenInfo = ctx.session.selectedTokenInfo;
  console.log("toTokenInfo...inside handleTokenBuy....", toTokenInfo);
  const nativeTokenBalance = ctx.session.nativeTokenBalance;
  const updateNotEnoughBalance = notEnoughBalance.replace(
    "{{walletAddress}}",
    ctx.session.smartAccountAddress
  );
  // checking if enough token balance
  if (Number(nativeTokenBalance) <= amount) {
    ctx.reply(updateNotEnoughBalance, {
      reply_markup: {
        inline_keyboard: closeButton,
      },
      parse_mode: "HTML",
    });
    return;
  }
  ctx.session.isBuying = true;
  const params = {
    coinTypeA: toTokenInfo,
    coinTypeB: nativeTokenInfo,
    amount: amount,
  };
  await swapTransaction(params, bot, ctx.chat.id, "swapTransaction", ctx);
};
