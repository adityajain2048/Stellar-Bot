import { CHAIN_NAME, swapTokenBaseUrl, transferTokenBaseUrl } from "../../config/config";
import { botInfo } from "../../constant/botInfo";
import { EmojiObject } from "../../constant/telegramEmoji";
import { getTokensPosition } from "../../utils/getTokensPosition";
export const handleSellAndManageTransfer = async (
  ctx: any,
  purpose: string
) => {
  try {
    const walletAddress = ctx.session.walletAddress;
    const url =
      purpose === "transfer" ? transferTokenBaseUrl : swapTokenBaseUrl;
    const positionArray = await getTokensPosition(walletAddress, ctx);
    let msg = `🌈 Your Assets Overview! 📊 Quickly choose a token from your portfolio and submit its address in the chat to buy, sell, or transfer.\n\n`;
    for (let i = 0; i < positionArray?.length; i++) {
      const tokenObject = positionArray[i];
      if(tokenObject.address === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" || tokenObject.currentPrice==-1) continue;
      msg += `${EmojiObject[i+1]} <a href="${(botInfo[CHAIN_NAME as keyof typeof botInfo] as any).tokenInfoUrl}/${tokenObject.address}" target="_blank">${tokenObject.symbol}</a>\nProfit :${tokenObject.pnlPercentage}% / ${
          tokenObject.pnlInNative
        } ${botInfo[CHAIN_NAME as keyof typeof botInfo].nativeToken} ${
          EmojiObject[tokenObject.pnlInUSD < 0 ? `loss` : `profit`]
        }\nValue:<b>$${tokenObject.currentAmountInUSD} / ${
          tokenObject.currentAmountInNative
        } ${botInfo[CHAIN_NAME as keyof typeof botInfo].nativeToken}</b>\nMCap:$${tokenObject.marketCap+" @ "+"$"+Number(tokenObject.currentPrice)?.toFixed(4)}\n5m:${tokenObject["5m"].toFixed(2)}%, 1h:${tokenObject[
        "1h"
      ].toFixed(2)}%, 6h:${tokenObject["6h"].toFixed(2)}% 24h:${tokenObject[
        "24h"
      ].toFixed(2)}%\nHotkey: /sell_${tokenObject.symbol}\nAddress: <code>${
        positionArray[i].address
      }</code>\n\n`;
    }
    msg += `👆 Select the token you want to interact with by clicking its hotkey, or enter another token address directly in the chat.`;
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
      disable_web_page_preview: true,
    });
  } catch (error) {
    console.log("Error in handleBuySell", error);
    ctx.reply("Error in getting token information..");
  }
};
