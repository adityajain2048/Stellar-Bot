import { closeButton } from "../../bot/buttons/telegramMsgButton";
import { CHAIN_NAME } from "../../config/config";
import { botInfo } from "../../constant/botInfo";
import { notEnoughBalance } from "../../constant/telegramMessage";
import { getTokenBalance } from "./getTokenBalance";
import { handleSwapToken } from "./handleSwapToken";
import { nativeTokenInfo } from "./constant";
import { bot } from "../..";
import { swapTransaction } from "../../helper/swapTransactoin";

export const handleTokenSell = async (percentage: number, ctx: any) => {
  ctx.session.isBuying = false;
  const walletAddress = ctx.session.smartAccountAddress;
  const tokenAddress = ctx.session.selectedTokenInfo.address;
  const tokenBalance = await getTokenBalance(walletAddress, tokenAddress, ctx);
  const balanceValidationMsg = `😕 Uh-oh! It looks like there might be a problem.\n\n🔍 Insufficient Token Balance It seems you don't have enough tokens to complete this sale. Please check your balance and try again.`;
  if (Number(tokenBalance) <= 0) {
    ctx.reply(balanceValidationMsg, {
      reply_markup: {
        inline_keyboard: closeButton,
      },
      parse_mode: "HTML",
    });
    return;
  }
  const amount = (Number(tokenBalance) * percentage) / 100;
  const selectedToken = ctx.session.selectedTokenInfo;
  const params = {
    coinTypeA: nativeTokenInfo,
    coinTypeB: selectedToken,
    amount: amount,
  };
  await swapTransaction(params, bot, ctx.chat.id, "swapTransaction", ctx);
};
