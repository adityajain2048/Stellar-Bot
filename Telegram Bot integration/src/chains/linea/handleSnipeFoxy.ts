import { snipeFoxy } from "../../bot/messages/snipeFoxyMessage";
import { CHAIN_NAME, foxy_contract_address } from "../../config/config";
import { tokenInfo } from "../../constant/tokenInfo";
import { sendBalance } from "../../helper/sendBalance";
import { bot } from "../../index";
import { nativeTokenInfo } from "./constant";
export const handleSnipeFoxy = async (ctx: any, amount: number) => {
  console.log("inside handleSnipeFoxy.....", foxy_contract_address, amount);

//   // snipping welcome message
//     ctx.reply(snipeFoxy, { parse_mode: "HTML" });

  // when snipping start below code will be executed to transfer amount in contract

  ctx.session.selectedTokenInfo = nativeTokenInfo;
  await sendBalance(
    { amount: amount, receiverAddress: foxy_contract_address },
    bot,
    ctx.chat.id,
    "sendBalance",
    ctx
  );
};
