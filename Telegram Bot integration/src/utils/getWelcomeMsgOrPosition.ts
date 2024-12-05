import {
  firstWelcomeMessage,
  secondWelcomeMsg,
} from "../bot/messages/welcomeMessage";
import { getERC20TokenBalance } from "../chains/linea/getERC20TokenBalance";
import { getWalletBalance } from "../helper/getWalletBalance";
import { seePositions } from "./seePositions";

export const getWelcomeMsgOrPosition = async (ctx: any, chatId: number) => {
  try {
    const walletAddress = ctx.session.smartAccountAddress;
    let isPrimaryTokenAvailable = false;
    let isSecondaryTokenAvailable = false;
    let pageReviewDisabled = false;
    let isPnlAvailable = false;
    let nativeBalance: any = 0;
    const assets = ctx.session.assets;
    // checkking if assets in redis
    if (assets) {
      for (let i = 0; i < assets?.length; i++) {
        if (
          assets[i].address === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
        ) {
          isPrimaryTokenAvailable = true;
          nativeBalance = Number(assets[i].availableAmount).toFixed(5);
        }
        if (
          assets[i].address !== "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
        ) {
          isSecondaryTokenAvailable = true;
        }
      }
    }
    let msgHome = ``;
    if (!isPrimaryTokenAvailable && !isSecondaryTokenAvailable) {
      let updatedFirstWelcomeMessage = firstWelcomeMessage.replace(
        "{{walletAddress}}",
        walletAddress
      );
      msgHome = updatedFirstWelcomeMessage;
    } else if (isPrimaryTokenAvailable && !isSecondaryTokenAvailable) {
      let updatedSecondWelcomeMsg = secondWelcomeMsg.replace(
        "{{amount}}",
        "" + nativeBalance
      );
      updatedSecondWelcomeMsg = updatedSecondWelcomeMsg.replace(
        "{{walletAddress}}",
        walletAddress
      );
      msgHome = updatedSecondWelcomeMsg;
    } else if (isPrimaryTokenAvailable && isSecondaryTokenAvailable) {
      msgHome = await seePositions(walletAddress, Number(nativeBalance), ctx);
      pageReviewDisabled = true;
      isPnlAvailable = true;
    }
    return {
      msgForUser: msgHome,
      urlReviewDisabled: pageReviewDisabled,
      isPnlAvailable: isPnlAvailable,
    };
  } catch (error) {
    console.log("Error in getting welcome msg or position", error);
    return {};
  }
};
