import { trendingTokens } from "./constant";
import { swapTokenBaseUrl, transferTokenBaseUrl } from "../../config/config";
export const handleBuySellTransfer = async (ctx: any, purpose: string) => {
  try {
    const url =
      purpose === "transfer" ? transferTokenBaseUrl : swapTokenBaseUrl;
    let msg = `📝<b>Just enter the token address directly in the chat.</b>\n\n🌟 Trending Tokens! 🚀\nSelect a token by clicking its hotkey and submit in chat. Trade with style and ease!\n\n`;
    for (let i = 0; i < trendingTokens?.length; i++) {
      msg += `🔹 <b>${trendingTokens[i].name}</b>\n Hotkey: /buy_${trendingTokens[i].symbol}\n Address:\n <code>${trendingTokens[i].address}</code>\n\n`;
    }
    msg += `Choose the token you wish to buy, sell, or transfer. Simply click the hotkey to enter the token address in chat.`;
    ctx.api.sendMessage(ctx.chat.id, msg, {
      reply_markup: {
        inline_keyboard: [
          [
            // { text: "More Tokens", web_app: { url: url } }
            { text: "❌ Close", callback_data: "cancel" },
          ],
        ],
      },
      parse_mode: "HTML",
    });
  } catch (error) {
    console.log("Error in handleBuySell", error);
    ctx.reply("Error in getting token information..");
  }
};
