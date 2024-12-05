import {
  firstWelcomeMessage,
  secondWelcomeMsg,
} from "../../bot/messages/welcomeMessage";
import { getWalletBalance } from "../../helper/getWalletBalance";
import { refreshAssest } from "../../services/refreshAssest";
import { seePositions } from "../../utils/seePositions";
import { getERC20TokenBalance } from "./getERC20TokenBalance";

export const seePnl = async (ctx: any) => {
  try {
    const chatId = ctx.chat.id;
    const walletAddress = ctx.session.smartAccountAddress;
    await refreshAssest(walletAddress, ctx);
    let isPrimaryTokenAvailable = false;
    let isSecondaryTokenAvailable = false;
    let pageReviewDisabled = false;
    let isPnlAvailable = false;
    let secondTokenBalance = 0;

    const nativeBalance = await getWalletBalance(walletAddress);
    const erc20Data = await getERC20TokenBalance(walletAddress);
    const tokenBalance = erc20Data?.items;
    // update the balance of the user in the database
    if (parseFloat(nativeBalance) > 0) {
      isPrimaryTokenAvailable = true;
    }
    if (tokenBalance?.length > 0) {
      isSecondaryTokenAvailable = true;
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
      msgHome = await seePositions(walletAddress, parseFloat(nativeBalance),ctx);
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
