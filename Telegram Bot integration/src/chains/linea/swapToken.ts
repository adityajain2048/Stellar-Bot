import { swapTransactionEVM } from "./swapTransactionEvm";
import {
  CHAIN_NAME,
  GIB_REWARD_ACCOUNT,
  PORFO_ACCOUNT_ADD,
  swapReceiptBaseUrl,
} from "../../config/config";
import { approveAmount } from "../../utils/approveAmount";
import { getTransferTx } from "./transferAmount";
import { ITokenInfo } from "../../interface/tokenInfo.interface";
import {
  closeButton,
  homeOrWalletButton,
} from "../../bot/buttons/telegramMsgButton";
import { createWallets, generatePrivateKey } from "../../bot/web3/wallet";
import { BiconomySmartAccountV2 } from "@biconomy/account";
import { botInfo } from "../../constant/botInfo";
import { getSwapQuote } from "./getSwapQuote";
import { getApprovalCallData, isTokenApproved } from "./approveToken";
import { getSwapQuoteByKyber } from "./getSwapQuoteByKyber";
import { priorityReferralAddress } from "./constant";
import { bot } from "../..";
import { resetUserContext } from "../../utils/resetUserContext";
import { getUserModel } from "../../models/userSchema";

export const swapToken = async (
  chatId: number,
  fromTokenInfo: ITokenInfo,
  toTokenInfo: ITokenInfo,
  amount: number,
  referralAddress: string,
  ctx: any
) => {
  try {
    const privateKey = generatePrivateKey(chatId.toString());
    const wallet = await createWallets(privateKey);
    const keypair = wallet?.smartAccount as BiconomySmartAccountV2;
    const walletAddress = ctx.session.smartAccountAddress;
    // change params.amount in 3 parts --> 1 . 99% 2. 0.6% 3. 0.4%

    // get quote for 99% amount to swap from token A to B
    // create a transfer txn for 0.6%  to Porfo Account Address in .env
    // get a quote for 0.4% amount to swap from token A to GIB (0x3efcd659b7a45d14dda8a102836ce4b765c42324) to GIBs rewards address.
    // checking approval of transaction
    const params = {
      fromToken: fromTokenInfo,
      toToken: toTokenInfo,
      amount,
    };
    let approvalData = null;
    // const isArroved = true;
    const isSelling =
      toTokenInfo.address ===
      botInfo[CHAIN_NAME as keyof typeof botInfo].nativeTokenAddress
        ? true
        : false;
    const percentage = isSelling ? 0.02 : 0.01;

    const isReferralDeduction =
      referralAddress !== "" && !isSelling ? true : false;
    const swapAmount = amount * (1 - percentage);
    const feesAmount = Math.floor(
      amount *
        (percentage *
          (isReferralDeduction
            ? priorityReferralAddress.includes(referralAddress)
              ? 0.6 // if referral is in priority list then 60% deduction of fees to wstf means referral goes to 40% of fees
              : 0.9 // by default referral goes to 10% of fees means 90% deduction of fees to wstf
            : 1)) *
        10 ** 18
    );
    // const amount3 = amount * (percentage * (isReferralDeduction ? 0.35 : 0.4));
    const referralAmount = isReferralDeduction
      ? priorityReferralAddress.includes(referralAddress)
        ? amount * percentage * 0.4 // if referral address is in list then 40% of fees goes to referral
        : amount * percentage * 0.1 // if referral address is not in list then 10% of fees goes to referral
      : 0; // if referral address is not available then 0% of fees goes to referral

    // const quote1 = await getSwapQuote(
    //   amount,
    //   params.fromToken,
    //   params.toToken,
    //   walletAddress
    // );

    const quote1 = await getSwapQuoteByKyber(
      swapAmount,
      fromTokenInfo,
      toTokenInfo,
      walletAddress
    );

    if (quote1.response.status === false) {
      // await ctx.api.sendMessage(chatId, quote1.response.message);
      await bot.api.editMessageText(
        chatId,
        ctx.session.lastMessageId,
        "" + quote1.response.message,
        {
          reply_markup: {
            inline_keyboard: closeButton,
          },
          parse_mode: "HTML",
        }
      );
      return;
    }
    const isArroved = await isTokenApproved(
      amount,
      walletAddress,
      quote1.response.routerAddress,
      fromTokenInfo
    );
    if (!isArroved)
      approvalData = await getApprovalCallData(
        amount,
        keypair,
        quote1.response.routerAddress,
        fromTokenInfo
      );
    const transferTxn = isSelling
      ? getTransferTx(PORFO_ACCOUNT_ADD ?? "", feesAmount, fromTokenInfo)
      : {
          to: PORFO_ACCOUNT_ADD ?? "",
          value: feesAmount,
        };

    const referralTransferTxn = isReferralDeduction
      ? {
          to: referralAddress,
          value: Math.floor(referralAmount * 10 ** fromTokenInfo.decimal),
        }
      : null;

    let transactionInfo = ``;
    const batchArray = [];
    if (!isArroved && approvalData) batchArray.push(approvalData);
    batchArray.push(quote1.response.message);
    batchArray.push(transferTxn);
    referralTransferTxn !== null && batchArray.push(referralTransferTxn);
    // ctx.api.sendMessage(
    //   ctx.chat.id,
    //   "Please wait while we process your transaction"
    // );
    const message = await bot.api.editMessageText(
      chatId,
      ctx.session.lastMessageId,
      "Please wait while we process your transaction"
    );
    if (message !== true) {
      ctx.session.lastMessageId = message.message_id;
    }

    const swapResult = await swapTransactionEVM(batchArray, keypair);
    if (swapResult.response.status === true) {
      const txHash = swapResult.response.message;
      const explorerUrl = `${
        botInfo[CHAIN_NAME as keyof typeof botInfo].explorerUrl
      }/tx/${txHash}`;
      transactionInfo += `Transaction Successful! \n`;
      const transactionSuccessButton = [
        [{ text: "🔍 See on Explorer", url: explorerUrl }],
        ...homeOrWalletButton,
      ];
      // await ctx.api.sendMessage(chatId, transactionInfo, {
      //   reply_markup: {
      //     inline_keyboard: transactionSuccessButton,
      //   },
      //   parse_mode: "HTML",
      // });
      await bot.api.editMessageText(
        chatId,
        ctx.session.lastMessageId,
        transactionInfo,
        {
          reply_markup: {
            inline_keyboard: transactionSuccessButton,
          },
          parse_mode: "HTML",
        }
      );

      // updating referal amount in db
      if (isReferralDeduction) {
        const userModel = getUserModel(CHAIN_NAME);
        const referredByUser = await userModel.findOne({
          walletAddress: referralAddress,
        });
        if (referredByUser) {
          referredByUser.referralEarned += referralAmount;
          await referredByUser.save();
        }
      }
    } else {
      // await ctx.api.sendMessage(chatId, swapResult.response.message);
      await bot.api.editMessageText(
        chatId,
        ctx.session.lastMessageId,
        swapResult.response.message,
        {
          reply_markup: {
            inline_keyboard: homeOrWalletButton,
          },
          parse_mode: "HTML",
        }
      );
    }
  } catch (error) {
    console.log("Error in swapping tokens", error);
    await bot.api.editMessageText(
      chatId,
      ctx.session.lastMessageId,
      "Error in swapping tokens",
      {
        reply_markup: {
          inline_keyboard: homeOrWalletButton,
        },
        parse_mode: "HTML",
      }
    );
  } finally {
    resetUserContext(ctx);
  }
};
