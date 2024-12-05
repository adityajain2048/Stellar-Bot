import { CHAIN_NAME } from "../../config/config";
import { tokenInfo } from "../../constant/tokenInfo";
import { swapTransaction } from "../../helper/swapTransactoin";
import { bot } from "../../index";
export const handleSwapToken = async (
  ctx: any,
  fromToken: string,
  toToken: string,
  amount: number
) => {
  // const tokens = tokenInfo[CHAIN_NAME as keyof typeof tokenInfo].tokens;
  // const fromTokenInfo = tokens.find(
  //   (token) =>
  //     token.address.toLocaleLowerCase() === fromToken.toLocaleLowerCase()
  // );

  // const toTokenInfo = tokens.find(
  //   (token) => token.address.toLocaleLowerCase() === toToken.toLocaleLowerCase()
  // );

  // const params = {
  //   coinTypeA: toTokenInfo,
  //   coinTypeB: fromTokenInfo,
  //   amount: amount,
  // };
  // await swapTransaction(params, bot, ctx.chat.id, "swapTransaction", ctx);
};
