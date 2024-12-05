import { swapTokenBaseUrl } from "../config/config";
import { homeButtons } from "../bot/buttons/telegramMsgButton";
/**
 * Generates a list of buy and sell options for a given token pair and wallet address.
 * @example
 * generateBuySellOptions("0x123abc", "0x456def", "0x789ghi")
 * @param {string} fromTokenAddress - The address of the token being sold.
 * @param {string} toTokenAddress - The address of the token being bought.
 * @param {string} walletAddress - The address of the wallet being used for the transaction.
 * @returns {Array} An array of objects containing the text and web_app url for buying and selling the given token pair.
 * @description
 *   - The buy and sell options are generated based on the provided token addresses and wallet address.
 *   - The options are returned as an array of objects.
 *   - The first item in the array is removed before being returned.
 *   - The options are formatted with the appropriate token addresses and wallet address for use in the web app.
 */
export const getHomeButtons = (
  fromTokenAddress: string,
  toTokenAddress: string,
  walletAddress: string
) => {
  try {
    const buySellToken = [
      {
        text: "💸 Buy",
        // web_app: {
        //   url: `${swapTokenBaseUrl}?from=${encodeURIComponent(
        //     fromTokenAddress
        //   )}&to=${encodeURIComponent(
        //     toTokenAddress
        //   )}&walletAddress=${encodeURIComponent(walletAddress)}`,
        // },
        callback_data: "trendingTokensBuy",
      },
      {
        text: "💰 Sell & Manage",
        // web_app: {
        //   url: `${swapTokenBaseUrl}?from=${encodeURIComponent(
        //     toTokenAddress
        //   )}&to=${encodeURIComponent(
        //     fromTokenAddress
        //   )}&walletAddress=${encodeURIComponent(walletAddress)}`,
        // },
        callback_data: "trendingTokensSell",
      },
    ];
    const tempHomeButtons = [...homeButtons];
    const firstItem = tempHomeButtons.shift();
    const newHomeButtons = [firstItem, buySellToken, ...tempHomeButtons];
    return newHomeButtons;
  } catch (error) {
    console.log("Error in getting home buttons", error);
  }
};
