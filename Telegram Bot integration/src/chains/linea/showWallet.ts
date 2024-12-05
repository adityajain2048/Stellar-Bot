import { walletButtons } from "../../bot/buttons/telegramMsgButton";
import { CHAIN_NAME } from "../../config/config";
import { botInfo } from "../../constant/botInfo";
import { getERCTokens } from "../../helper/getERCTokens";
import { getWalletBalance } from "../../helper/getWalletBalance";

export const showWallet = async (ctx: any) => {
  const walletAddress = ctx.session.smartAccountAddress;
  const chatId = ctx.chat.id;
  console.log("inside showWallet............", walletAddress);
  const nativeBalance = await getWalletBalance(walletAddress);
  const tokenBalance = await getERCTokens(walletAddress);
  const walletPosition = `💰 Your Wallet \n\n💳Wallet Address:\n<code>${walletAddress}</code>\n(tap to copy above address)\n\nBalance:<b>${nativeBalance}</b> ${
    botInfo[CHAIN_NAME as keyof typeof botInfo].nativeToken
  }\n\n`;
  const explorerUrl = `${
    botInfo[CHAIN_NAME as keyof typeof botInfo].explorerUrl
  }/address/${walletAddress}`;
  const updatedWalletButtons = [
    [{ text: "🔍 View On Explorer", url: explorerUrl }],
    ...walletButtons,
    [{ text: "❌ Close", callback_data: "cancel" }],
  ];
  const sentMessage = await ctx.api.sendMessage(chatId, walletPosition, {
    reply_markup: {
      inline_keyboard: updatedWalletButtons,
    },
    parse_mode: "HTML",
  });
  ctx.session.walletMessageId = sentMessage.message_id;
};
