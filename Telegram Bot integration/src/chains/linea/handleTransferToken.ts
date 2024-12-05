import { CHAIN_NAME } from "../../config/config";
import { tokenInfo } from "../../constant/tokenInfo";
import { sendBalance } from "../../helper/sendBalance";
import { bot } from "../../index";
export const handleTransferToken = async (ctx: any, tokenAddress: string,amount:number) => {
  console.log("inside handleTransferToken.....", tokenAddress,amount);
  const tokens = tokenInfo[CHAIN_NAME as keyof typeof tokenInfo].tokens;
  const selectedToken = tokens.find(
    (token) =>
      token.address.toLocaleLowerCase() === tokenAddress.toLocaleLowerCase()
  );
  console.log("selectedToken............info....", selectedToken);
  ctx.session.selectedTokenInfo = selectedToken;
  await sendBalance(
    { amount: amount, receiverAddress: "" },
    bot,
    ctx.chat.id,
    "sendBalance",
    ctx
  );
};
