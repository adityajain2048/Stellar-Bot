import { getTokensPosition } from "./getTokensPosition";
import { CHAIN_NAME } from "../config/config";
import { botInfo } from "../constant/botInfo";
import { EmojiObject } from "../constant/telegramEmoji";
export const seePositions = async (
  walletAddress: string,
  nativeBalance: number,
  ctx: any
) => {
  try {
    const positionArray = await getTokensPosition(walletAddress, ctx);

    let positionMsg = `PNL📈📉\n\nPositions Overview📊:\n\n`;
    let totalBalance = nativeBalance;
    let count = 1;
    for (let i = 0; i < positionArray?.length; i++) {
      if (
        positionArray[i].address ===
        botInfo[CHAIN_NAME as keyof typeof botInfo].nativeTokenAddress || positionArray[i].currentPrice == -1
      ) {
        continue;
      }
      totalBalance += positionArray[i].currentAmountInNative;
      const tokenObject = positionArray[i];
      const symbol = tokenObject.symbol;
      // Create a clickable link using an anchor tag
      // const tokenMarketCapPriceChangeInfo = await getMarketCapPriceChangesInfo(tokenName);
      // const url = `${(botInfo[CHAIN_NAME as keyof typeof botInfo] as any).tokenInfoUrl}/${tokenObject.address}`;
      const tokenLink = `${
        EmojiObject[count as keyof typeof EmojiObject]
      } <a href="" target="_blank">${symbol}</a>`;
      positionMsg += `${tokenLink}\n`;
      positionMsg += `Profit: <b>${tokenObject.pnlPercentage}% / ${
        tokenObject.pnlInNative
      } ${botInfo[CHAIN_NAME as keyof typeof botInfo].nativeToken} ${
        EmojiObject[tokenObject.pnlInUSD < 0 ? "loss" : "profit"]
      }</b>\n`;
      positionMsg += `Value:<b>$${tokenObject.currentAmountInUSD} / ${
        tokenObject.currentAmountInNative
      } ${botInfo[CHAIN_NAME as keyof typeof botInfo].nativeToken}</b>\n`;
      positionMsg += `${tokenObject.marketCap===null?"FDV":"MCap"}: <b>${tokenObject.marketCap===null?"$"+tokenObject.fdv+" @ "+"$"+Number(tokenObject.currentPrice)?.toFixed(4):"$"+tokenObject.marketCap+" @ "+"$"+Number(tokenObject.currentPrice)?.toFixed(4)}</b>\n`;
      positionMsg += `5m: <b>${tokenObject["5m"]?.toFixed(2)}</b>%, 1h: <b>${tokenObject[
        "1h"
      ]?.toFixed(2)}</b>%, 6h: <b>${tokenObject["6h"]?.toFixed(2)}</b>% 24h: <b>${tokenObject[
        "24h"
      ]?.toFixed(2)}</b>%\n\n`;
      count++;
    }
    positionMsg += `\n\n${
      botInfo[CHAIN_NAME as keyof typeof botInfo].nativeToken
    } Balance: <b>${nativeBalance} ${
      botInfo[CHAIN_NAME as keyof typeof botInfo].nativeToken
    }</b>\n`;
    return (
      positionMsg +
      `Networth: <b>${totalBalance?.toFixed(5)} ${
        botInfo[CHAIN_NAME as keyof typeof botInfo].nativeToken
      }</b>\n`
    );
  } catch (error) {
    console.log("Error in getting positions", error);
    return "token informaton not available..";
  }
};
