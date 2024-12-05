import { Composer } from "grammy";
import { CustomContext } from "../context/CustomContext";
import { logHandle } from "../helpers/logger";
import { showWallet } from "../../chains/linea/showWallet";
import { showWalletAddress } from "../../chains/linea/showWalletAddress";
import { transferTokenByWebApp } from "../../chains/linea/transferTokenByWebApp";
import { swapTokenByWebApp } from "../../chains/linea/swapTokenByWebApp";
import { botInfo } from "../../constant/botInfo";
import { CHAIN_NAME } from "../../config/config";
import { bot } from "../..";
import { getWalletBalance } from "../../helper/getWalletBalance";
import { handleMessage } from "../helpers/handleMessage";
import { handleSignIn } from "../../helper/handleSignIn";
import { tokenInfo } from "../../constant/tokenInfo";
import { swapTransaction } from "../../helper/swapTransactoin";
import { nativeTokenInfo, symbolToAddress } from "../../chains/linea/constant";
import { sponsuredTokenInfo } from "../../chains/linea/constant";
import { handleTransferToken } from "../../chains/linea/handleTransferToken";
import { handleSwapToken } from "../../chains/linea/handleSwapToken";
import { handleSnipeFoxy } from "../../chains/linea/handleSnipeFoxy";
import {
  privateKeyMessage,
  referToFriendMsg,
} from "../../constant/telegramMessage";
import {
  closeButton,
  homeOrWalletButton,
  privateAddressConfirmationButton,
} from "../buttons/telegramMsgButton";
import { getHomeButtons } from "../../utils/getHomeButtons";
import { handleRefreshHome } from "../../chains/linea/handleRefreshHome";
import { snipeFoxy } from "../messages/snipeFoxyMessage";
import { handleStartCommand } from "../../helper/handleStartCommond";
import { resetUserContext } from "../../utils/resetUserContext";
import { handleBuySellTransfer } from "../../chains/linea/handleBuySellTransfer";
import { refreshAssest } from "../../services/refreshAssest";
import { seePnl } from "../../chains/linea/seePnl";
import { getTokenBalance } from "../../chains/linea/getTokenBalance";
import { handleTokenBuy } from "../../chains/linea/handleTokenBuy";
import { handleSellAndManageTransfer } from "../../chains/linea/handleSellAndManageTransfer";
import { getTokenInformation } from "../../chains/linea/getTokenInformation";

import { handleTokenSell } from "../../chains/linea/handleTokenSell";
import { getUserModel } from "../../models/userSchema";

const composer = new Composer<CustomContext>();

const feature = composer.chatType("private");

feature.on("message", logHandle("unhandled-message"), async (ctx) => {
  ctx.api.sendChatAction(ctx.chat.id, "typing");
  await handleMessage(ctx);
});

// wallet information
feature
  .filter((ctx) => ctx.callbackQuery?.data === "wallet")
  .on("callback_query", async (ctx) => {
    await showWallet(ctx);
  });

// deposit amount
feature
  .filter((ctx) => ctx.callbackQuery?.data === "deposit")
  .on("callback_query", async (ctx) => {
    await showWalletAddress(ctx);
  });

// transferTokenByWebApp
feature
  .filter((ctx) => ctx.callbackQuery?.data === "yesTransferByWebApp")
  .on("callback_query", async (ctx) => {
    // ctx.reply("transaction in progress...");
    const walletAddress = ctx.session.smartAccountAddress;
    const message_id = await ctx.api.sendMessage(
      ctx.chat.id,
      "transaction in progress..."
    );
    console.log("message_id............", message_id);
    ctx.session.lastMessageId = message_id.message_id;
    const { amount, receiverAddress, tokenAddress } =
      ctx.session.trackObject?.functionParams;
    const tokens = tokenInfo[CHAIN_NAME as keyof typeof tokenInfo].tokens;
    const selectedToken = tokens.find(
      (token) =>
        token.address.toLocaleLowerCase() === tokenAddress.toLocaleLowerCase()
    );
    ctx.session.selectedTokenInfo = selectedToken;
    await transferTokenByWebApp(
      amount,
      receiverAddress,
      selectedToken,
      ctx.chat.id
    );
    // resetting usercontext
    await resetUserContext(ctx);
    // updating user wallet balance
    await refreshAssest(walletAddress, ctx);
  });

// swapTokenByWebApp
feature
  .filter((ctx) => ctx.callbackQuery?.data === "yesSwapByWebApp")
  .on("callback_query", async (ctx) => {
    console.log("inside yesSwapByWebApp...........");
    // await ctx.reply("transaction in progress...");
    const message = await bot.api.editMessageText(
      ctx.chat.id,
      ctx.session.lastMessageId,
      `transaction in progress...`,
      {
        parse_mode: "HTML",
      }
    );
    console.log("message.....inside yesswapbywebapp.......", message);
    if (message !== true) {
      ctx.session.lastMessageId = message.message_id;
    }
    const { amount, fromTokenInfo, toTokenInfo } =
      ctx.session.trackObject.functionParams;
    const walletAddress = ctx.session.smartAccountAddress;
    await swapTokenByWebApp(
      Number(amount),
      fromTokenInfo,
      toTokenInfo,
      walletAddress !== null ? walletAddress : "",
      ctx.chat.id,
      ctx
    );

    // resetting usercontext
    await resetUserContext(ctx);
    // updating user wallet balance
    await refreshAssest(walletAddress, ctx);
  });

// transfer x native token transfer x native token data collection
feature
  .filter((ctx) => ctx.callbackQuery?.data === "transferXnative")
  .on("callback_query", async (ctx) => {
    console.log("inside transferXnative...........");
    ctx.session.isMaticTransfer = true;
    ctx.session.tranferTokenName =
      botInfo[CHAIN_NAME as keyof typeof botInfo].nativeToken;
    const tokenAddress =
      botInfo[CHAIN_NAME as keyof typeof botInfo].nativeTokenAddress;
    if (tokenAddress !== null) {
      await handleTransferToken(ctx, tokenAddress, 0);
    }
  });

// transfer x native token transfer

feature
  .filter((ctx) => ctx.callbackQuery?.data === "yesTransferToken")
  .on("callback_query", async (ctx) => {
    ctx.reply("transaction in progress...");
    const walletAddress = ctx.session.smartAccountAddress;
    const { amount, receiverAddress } = ctx.session.trackObject?.functionParams;
    const tokenInfo = ctx.session.selectedTokenInfo;
    ctx.session.isMaticTransfer = true;
    ctx.session.tranferTokenName =
      botInfo[CHAIN_NAME as keyof typeof botInfo].nativeToken;
    await transferTokenByWebApp(
      amount,
      receiverAddress,
      tokenInfo,
      ctx.chat.id
    );
    // resetting usercontext
    await resetUserContext(ctx);
    // updating user wallet balance
    await refreshAssest(walletAddress, ctx);
  });

// transfer all native token transfer all native token data collection
feature
  .filter((ctx) => ctx.callbackQuery?.data === "transferAllnative")
  .on("callback_query", async (ctx) => {
    // getting total native balance
    const tokenAddress =
      botInfo[CHAIN_NAME as keyof typeof botInfo].nativeTokenAddress;
    const walletAddress = ctx.session.smartAccountAddress;
    const nativeBalance = await getWalletBalance(walletAddress);
    if (Number(nativeBalance) > 0.0001) {
      // transfering only 95% of the balance to the user
      const transferAmount = (Number(nativeBalance) * 95) / 100;
      ctx.session.isMaticTransfer = true;
      ctx.session.tranferTokenName =
        botInfo[CHAIN_NAME as keyof typeof botInfo].nativeToken;
      if (tokenAddress !== null) {
        await handleTransferToken(ctx, tokenAddress, transferAmount);
      }
    } else {
      ctx.reply(
        "Insufficient balance to transfer balance should be more than $1.0"
      );
    }
  });

// mpin creation

feature
  .filter((ctx) => ctx.callbackQuery?.data === "secureSignIn")
  .on("callback_query", async (ctx) => {
    await handleSignIn(
      { mpin: null, reMpin: null },
      bot,
      ctx.chat.id,
      "handleSignIn",
      ctx
    );
  });

// cancel operation
feature
  .filter((ctx) => ctx.callbackQuery?.data === "no")
  .on("callback_query", async (ctx) => {
    await ctx.api.sendMessage(ctx.chat.id, "Operation cancelled!");
    //deleting message id
  });

// buyFoxy
feature
  .filter((ctx) => ctx.callbackQuery?.data === "buyFoxy")
  .on("callback_query", async (ctx) => {
    console.log("inside buyFoxy............");
    ctx.session.isBuying = true;
    const params = {
      coinTypeA: sponsuredTokenInfo,
      coinTypeB: nativeTokenInfo,
      amount: 0,
    };
    await swapTransaction(params, bot, ctx.chat.id, "swapTransaction", ctx);
  });

// sellFoxy
feature
  .filter((ctx) => ctx.callbackQuery?.data === "sellFoxy")
  .on("callback_query", async (ctx) => {
    ctx.session.isBuying = false;
    const sponsuredTokenAddress = sponsuredTokenInfo.address;
    const tokens = tokenInfo[CHAIN_NAME as keyof typeof tokenInfo].tokens;
    const selectedToken = tokens.find(
      (token) =>
        token.address.toLocaleLowerCase() ===
        sponsuredTokenAddress.toLocaleLowerCase()
    );
    ctx.session.selectedTokenInfo = selectedToken;
    const params = {
      coinTypeA: nativeTokenInfo,
      coinTypeB: sponsuredTokenInfo,
      amount: 0,
    };
    await swapTransaction(params, bot, ctx.chat.id, "swapTransaction", ctx);
  });
// snipeFoxy handleSnipeFoxy
feature
  .filter((ctx) => ctx.callbackQuery?.data === "snipeFoxy")
  .on("callback_query", async (ctx) => {
    // snipping welcome message
    ctx.reply(snipeFoxy, { parse_mode: "HTML" });

    await handleSnipeFoxy(ctx, 0);
  });
// transfer by token address transferToken
feature
  .filter((ctx) => ctx.callbackQuery?.data === "transferToken")
  .on("callback_query", async (ctx) => {
    console.log("inside transferXnative...........");
    const tokenAddress = ctx.session.selectedTokenAddress;
    if (tokenAddress !== null) {
      await handleTransferToken(ctx, tokenAddress, 0);
    }
  });

// buy token by token address buyToken
feature
  .filter((ctx) => ctx.callbackQuery?.data === "buyToken")
  .on("callback_query", async (ctx) => {
    ctx.session.isBuying = true;
    const nativeTokenAddress =
      botInfo[CHAIN_NAME as keyof typeof botInfo].nativeTokenAddress;
    const tokenAddress = ctx.session.selectedTokenAddress;
    if (tokenAddress !== null) {
      await handleSwapToken(ctx, nativeTokenAddress, tokenAddress, 0);
    }
  });

// sell token by token address sellToken
feature
  .filter((ctx) => ctx.callbackQuery?.data === "sellToken")
  .on("callback_query", async (ctx) => {
    ctx.session.isBuying = false;
    const selectedToken = ctx.session.selectedTokenInfo;
    const params = {
      coinTypeA: nativeTokenInfo,
      coinTypeB: selectedToken,
      amount: 0,
    };
    await swapTransaction(params, bot, ctx.chat.id, "swapTransaction", ctx);
  });

// exporting private key  export private key
feature
  .filter((ctx) => ctx.callbackQuery?.data === "export private key")
  .on("callback_query", async (ctx) => {
    return await ctx.reply(privateKeyMessage, {
      reply_markup: {
        inline_keyboard: privateAddressConfirmationButton,
      },
      parse_mode: "HTML",
    });
  });

// showing private key
feature
  .filter((ctx) => ctx.callbackQuery?.data === "show private key")
  .on("callback_query", async (ctx) => {
    const privateKey = ctx.session.privateKey;
    ctx.reply(
      `Your Private key::\n\n\n <code>${privateKey}</code>\n\nTap to copy\n\n <b>Delete this message once you are done.</b>\n`,
      {
        reply_markup: {
          inline_keyboard: [[{ text: "❌ Delete", callback_data: "cancel" }]],
        },
        parse_mode: "HTML",
      }
    );
  });
// cancelling operation
feature
  .filter((ctx) => ctx.callbackQuery?.data === "cancel")
  .on("callback_query", async (ctx) => {
    const messageIdToDelete = ctx.update.callback_query.message.message_id;
    await ctx.api.deleteMessage(ctx.chat.id, messageIdToDelete);
  });
// refresh Home....
feature
  .filter((ctx) => ctx.callbackQuery?.data === "refreshHome")
  .on("callback_query", async (ctx) => {
    const walletAddress = ctx.session.smartAccountAddress;
    const homeButtons = getHomeButtons(
      botInfo[CHAIN_NAME as keyof typeof botInfo].fromTokenAddress,
      botInfo[CHAIN_NAME as keyof typeof botInfo].toTokenAddress,
      walletAddress
    );
    const msgHome = await handleRefreshHome(ctx, ctx.chat.id);
    ctx.session.homeRefreshCount += 1;
    await ctx.editMessageText(
      `${msgHome}\nRefresh count:${ctx.session.homeRefreshCount}`,
      {
        reply_markup: {
          inline_keyboard: homeButtons,
        },
        parse_mode: "HTML",
      }
    );
  });

// home
feature
  .filter((ctx) => ctx.callbackQuery?.data === "home")
  .on("callback_query", async (ctx) => {
    await handleStartCommand(ctx, ctx.chat.id);
  });

// refer to friend
feature
  .filter((ctx) => ctx.callbackQuery?.data === "referToFriend")
  .on("callback_query", async (ctx) => {
    const walletAddress = ctx.session.smartAccountAddress;
    const userModel = getUserModel(CHAIN_NAME);
    const userInfo = await userModel.findOne({
      walletAddress: walletAddress,
    });
    const referralCount = userInfo?.referralCount;
    const referralEarned = userInfo?.referralEarned;
    let message = referToFriendMsg.replace(
      "{{botReferLink}}",
      `https://t.me/sideLineaBot?start=${ctx.chat.id}`
    );
    message = message.replace("{{referralCount}}", ""+referralCount);
    message = message.replace("{{referralEarned}}", ""+referralEarned);
    ctx.reply(message, {
      reply_markup: {
        inline_keyboard: closeButton,
      },
      parse_mode: "HTML",
    });
  });

// selecting trending token for buy
feature
  .filter((ctx) => ctx.callbackQuery?.data === "trendingTokensBuy")
  .on("callback_query", async (ctx) => {
    console.log("inside trending token....");
    await handleBuySellTransfer(ctx, "buySell");
  });
// selecting trending token for sell
feature
  .filter((ctx) => ctx.callbackQuery?.data === "trendingTokensSell")
  .on("callback_query", async (ctx) => {
    console.log("inside trending token....");
    await handleSellAndManageTransfer(ctx, "buySell");
  });
// selecting trending token for trnasfer
feature
  .filter((ctx) => ctx.callbackQuery?.data === "trendingTokensTransfer")
  .on("callback_query", async (ctx) => {
    console.log("inside trending token....");
    await handleSellAndManageTransfer(ctx, "transfer");
  });

// see pnl   seepnl
feature
  .filter((ctx) => ctx.callbackQuery?.data === "seePnl")
  .on("callback_query", async (ctx) => {
    const { msgForUser, urlReviewDisabled, isPnlAvailable } = await seePnl(ctx);
    let messageId = null;

    messageId = await ctx.api.sendMessage(ctx.chat.id, msgForUser, {
      reply_markup: {
        inline_keyboard: homeOrWalletButton,
      },
      parse_mode: "HTML",
    });
  });

// buy 0.001
feature
  .filter((ctx) => ctx.callbackQuery?.data === "buy 0.001")
  .on("callback_query", async (ctx) => {
    await handleTokenBuy(0.001, ctx);
  });
// buy 0.01
feature
  .filter((ctx) => ctx.callbackQuery?.data === "buy 0.01")
  .on("callback_query", async (ctx) => {
    await handleTokenBuy(0.01, ctx);
  });
// buy x amount
feature
  .filter((ctx) => ctx.callbackQuery?.data === "buy X")
  .on("callback_query", async (ctx) => {
    ctx.session.isBuying = true;
    const toTokenInfo = ctx.session.selectedTokenInfo;
    const params = {
      coinTypeA: toTokenInfo,
      coinTypeB: nativeTokenInfo,
      amount: 0,
    };
    await swapTransaction(params, bot, ctx.chat.id, "swapTransaction", ctx);
  });
// sell 25%
feature
  .filter((ctx) => ctx.callbackQuery?.data === "sell 25%")
  .on("callback_query", async (ctx) => {
    ctx.session.isBuying = false;
    // const walletAddress = ctx.session.smartAccountAddress;
    // const tokenAddress = ctx.session.selectedTokenInfo.address;
    // const tokenBalance = await getTokenBalance(
    //   walletAddress,
    //   tokenAddress,
    //   ctx
    // );
    // const amount = (Number(tokenBalance) * 25) / 100;
    // const selectedToken = ctx.session.selectedTokenInfo;
    // const params = {
    //   coinTypeA: nativeTokenInfo,
    //   coinTypeB: selectedToken,
    //   amount: amount,
    // };
    // await swapTransaction(params, bot, ctx.chat.id, "swapTransaction", ctx);
    await handleTokenSell(25, ctx);
  });
// sell 50%
feature
  .filter((ctx) => ctx.callbackQuery?.data === "sell 50%")
  .on("callback_query", async (ctx) => {
    ctx.session.isBuying = false;
    // const walletAddress = ctx.session.smartAccountAddress;
    // const tokenAddress = ctx.session.selectedTokenInfo.address;
    // const tokenBalance = await getTokenBalance(
    //   walletAddress,
    //   tokenAddress,
    //   ctx
    // );
    // const amount = (Number(tokenBalance) * 50) / 100;
    // const selectedToken = ctx.session.selectedTokenInfo;
    // const params = {
    //   coinTypeA: nativeTokenInfo,
    //   coinTypeB: selectedToken,
    //   amount: amount,
    // };
    // await swapTransaction(params, bot, ctx.chat.id, "swapTransaction", ctx);
    await handleTokenSell(50, ctx);
  });
// sell X%
feature
  .filter((ctx) => ctx.callbackQuery?.data === "sell X%")
  .on("callback_query", async (ctx) => {
    ctx.session.isBuying = false;
    const selectedToken = ctx.session.selectedTokenInfo;
    const params = {
      coinTypeA: nativeTokenInfo,
      coinTypeB: selectedToken,
      amount: 0,
    };
    await swapTransaction(params, bot, ctx.chat.id, "swapTransaction", ctx);
  });
export { composer as unhandledFeature };
