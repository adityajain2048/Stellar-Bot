import { bot} from "..";
import { swapTransactionEVM } from "../Polygon/swapTransactionPolygon";
import {
  GIB_REWARD_ACCOUNT,
  PORFO_ACCOUNT_ADD,
  swapReceiptBaseUrl,
} from "../config/config";
import { approveAmount } from "../utils/approveAmount";
import { ITokenInfo } from "../interface/tokenInfo.interface";
import { homeOrWalletButton } from "../bot/buttons/telegramMsgButton";

export const swapPolygonTokens = async (
  chatId: number,
  fromTokenInfo: ITokenInfo,
  toTokenInfo: ITokenInfo,
  amount: number,
  referralAddress: string
) => {
  try {
    // console.log("inside swaptoken....");
    // const userContext = userContexts.get(chatId);
    // const keypair = userContext.keypairObject;
    // const walletAddress = userContext.saAddress;
    // // change params.amount in 3 parts --> 1 . 99% 2. 0.6% 3. 0.4%

    // // get quote for 99% amount to swap from token A to B
    // // create a transfer txn for 0.6%  to Porfo Account Address in .env
    // // get a quote for 0.4% amount to swap from token A to GIB (0x3efcd659b7a45d14dda8a102836ce4b765c42324) to GIBs rewards address.
    // // checking approval of transaction
    // const params = {
    //   fromToken: fromTokenInfo,
    //   toToken: toTokenInfo,
    //   amount,
    // };
    // let approvalData = null;
    // const isArroved = await approveAmount(
    //   amount,
    //   userContext.saAddress,
    //   fromTokenInfo
    // );
    // if (!isArroved)
    //   approvalData = await getApprovalTxn(amount, keypair, fromTokenInfo);

    // const isSelling =
    //   toTokenInfo.address === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
    //     ? true
    //     : false;
    // const percentage = isSelling ? 0.02 : 0.01;

    // const isReferralDeduction =
    //   referralAddress !== "" && !isSelling ? true : false;
    // const amount1 = amount * (1 - percentage);
    // const amount2 = Math.floor(
    //   amount * (percentage * (isReferralDeduction ? 0.55 : 0.6)) * 10 ** 18
    // );
    // const amount3 = amount * (percentage * (isReferralDeduction ? 0.35 : 0.4));
    // const amount4 = isReferralDeduction
    //   ? Math.floor(amount * (percentage * 0.1) * 10 ** 18)
    //   : 0;

    // const quote1 = await getQuote(
    //   amount1,
    //   params,
    //   walletAddress,
    //   keypair,
    //   walletAddress
    // );

    // const transferTxn = isSelling
    //   ? getTransferTx(PORFO_ACCOUNT_ADD, amount2)
    //   : {
    //       to: PORFO_ACCOUNT_ADD,
    //       value: amount2,
    //     };

    // const referralTransferTxn = isReferralDeduction
    //   ? {
    //       to: referralAddress,
    //       value: amount4,
    //     }
    //   : null;

    // const quote2 = isSelling
    //   ? {
    //       response: {
    //         status: true,
    //         message: {
    //           tx: getTransferTx(
    //             GIB_REWARD_ACCOUNT,
    //             amount3 * 10 ** fromTokenInfo.decimals
    //           ),
    //         },
    //       },
    //     }
    //   : await getQuote(
    //       amount3,
    //       params,
    //       userContext.saAddress,
    //       keypair,
    //       GIB_REWARD_ACCOUNT
    //     );

    // let transactionInfo = ``;
    // if (quote1.response.status === true && quote2.response.status === true) {
    //   const batchArray = [
    //     quote1.response.message.tx,
    //     transferTxn,
    //     quote2.response.message.tx,
    //   ];

    //   // checking if there is referral address available then insert into batch transaction
    //   referralTransferTxn !== null && batchArray.push(referralTransferTxn);

    //   if (!isArroved) batchArray.unshift(approvalData);
    //   const swapResult = await swapTransactionEVM(
    //     batchArray,
    //     userContext.keypairObject
    //   );
    //   if (swapResult.response.status === true) {
    //     // getting matic and gib current price from database
    //     // const maticInfo = await PolygonTokenPriceModel.findOne({
    //     //   tokenSymbol: "MATIC",
    //     // });
    //     // const gibInfo = await PolygonTokenPriceModel.findOne({
    //     //   tokenSymbol: "GIB",
    //     // });
    //     const maticPrice = 1;
    //     const gibPrice = 1;
    //     //   const polygonScanLink = `https://polygonscan.com/tx/${swapResult.response.message}`;
    //     const txHash = swapResult.response.message;
    //     // const txHash = "0xf931891fa05439e526947da0c389b7984b83a2f59ae762135f618c5f4be5860b";
    //     const receiptUrl = `${swapReceiptBaseUrl}?txHash=${encodeURIComponent(
    //       txHash
    //     )}&sAddress=${encodeURIComponent(
    //       userContext.saAddress
    //     )}&maticPrice=${maticPrice}&gibPrice=${gibPrice}`;
    //     transactionInfo += `Transaction Successful! \n`;
    //     const transactionSuccessButton = [
    //       [{ text: "See Receipt", web_app: { url: receiptUrl } }],
    //       ...homeOrWalletButton,
    //     ];
    //     await bot.api.sendMessage(chatId, transactionInfo, {
    //       reply_markup: {
    //         inline_keyboard: transactionSuccessButton,
    //       },
    //       parse_mode: "HTML",
    //     });
    //   } else {
    //     await bot.api.sendMessage(chatId, swapResult.response.message);
    //   }
    // } else {
    //   console.log("quote1", quote1);
    //   console.log("quote2", quote2);
    //   transactionInfo += quote1.response.status
    //     ? quote1.response.message
    //     : quote2.response.message;
    //   await bot.api.sendMessage(chatId, transactionInfo);
    // }
  } catch (error) {
    console.log("Error in swapping tokens", error);
  }
};
