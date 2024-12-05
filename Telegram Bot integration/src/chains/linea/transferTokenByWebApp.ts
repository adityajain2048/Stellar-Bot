import { BiconomySmartAccountV2, PaymasterMode } from "@biconomy/account";
import { BigNumberish, ethers } from "ethers";
import { createWallets, generatePrivateKey } from "../../bot/web3/wallet";
import { botInfo } from "../../constant/botInfo";
import { CHAIN_NAME } from "../../config/config";
import { bot } from "../..";
import { homeOrWalletButton } from "../../bot/buttons/telegramMsgButton";
export const transferTokenByWebApp = async (
  amount: number,
  receiverAddress: string,
  tokenInfo: any,
  chatId: number
) => {
  try {
    console.log(
      "inside linea transferTokenByWebApp....",
      amount,
      receiverAddress,
      tokenInfo
    );
    if (ethers.isAddress(receiverAddress)) {
      console.log("inside if condition.... linea transferTokenByWebApp....");
      const isNative =
        tokenInfo.address?.toLowerCase() ===
        botInfo[
          CHAIN_NAME as keyof typeof botInfo
        ].nativeTokenAddress.toLowerCase()
          ? true
          : false;
      //   const smartWallet = keypair as BiconomySmartAccountV2;
      // creating smart wallet for transaction
      const privateKey = generatePrivateKey(chatId.toString());
      const wallet = await createWallets(privateKey);
      const txnStatus = await sendTransaction(
        wallet?.smartAccount as BiconomySmartAccountV2,
        ethers.parseUnits(amount + "", tokenInfo.decimal).toString(),
        receiverAddress,
        tokenInfo.address,
        "",
        isNative
      );
      // return txnStatus;
      let transactionInfo = ``;
      const txHash = txnStatus.response.message;
      const explorerUrl = `${
        botInfo[CHAIN_NAME as keyof typeof botInfo].explorerUrl
      }/tx/${txHash}`;
      transactionInfo += `Transaction Successful! \n`;
      const transactionSuccessButton = [
        // [{ text: "See Receipt", web_app: { url: receiptUrl } }],
        [{ text: "🔍 See on Explorer", url: explorerUrl }],
        ...homeOrWalletButton,
      ];
      await bot.api.sendMessage(chatId, transactionInfo, {
        reply_markup: {
          inline_keyboard: transactionSuccessButton,
        },
        parse_mode: "HTML",
      });
    }
  } catch (error) {
    console.log("Error in transfering ERC20..............", error);
    await bot.api.sendMessage(
      chatId,
      "Error in swapping tokens",
      {
        reply_markup: {
          inline_keyboard: homeOrWalletButton,
        },
        parse_mode: "HTML",
      }
    );
    return { response: { status: false, message: "Transaction failed" } };
    
  }
};

export const sendTransaction = async (
  smartAccount: BiconomySmartAccountV2,
  value: number | BigNumberish,
  to: string,
  tokenAddress: string,
  data?: string,
  isNative?: boolean
) => {
  console.log(
    "inside send transaction....",
    value,
    to,
    tokenAddress,
    data,
    isNative
  );
  try {
    let tx;
    if (isNative) {
      tx = {
        to: to,
        data: "0x",
        value: value,
      };
    } else {
      const erc20Interface = new ethers.Interface([
        "function transfer(address _to, uint256 _value)",
      ]);
      const encodedData = erc20Interface.encodeFunctionData("transfer", [
        to,
        value,
      ]);
      const contractAddress = tokenAddress;
      tx = {
        to: contractAddress, // destination smart contract address
        data: encodedData,
      };
    }
    const userOpResponse = await smartAccount.sendTransaction(
      tx
      //   {
      //   paymasterServiceData: { mode: PaymasterMode.SPONSORED },
      // }
    );
    console.log("usderObjcs........inside sendTransaction....", userOpResponse);

    const { transactionHash } = await userOpResponse.waitForTxHash();
    console.log("Transaction Hash", transactionHash);
    const userOpReceipt = await userOpResponse.wait();
    if (userOpReceipt.success == "true") {
      return {
        response: {
          status: true,
          message: userOpReceipt.receipt.transactionHash,
        },
      };
    }
    return { response: { status: false, message: "Transaction failed" } };
  } catch (err) {
    console.log("transfer execution failed....", err);
    return { response: { status: false, message: "Transaction failed" } };
  }
};

export function getTransferTx(to: string, value: number, tokenAddress: string) {
  console.log("inside getTraTx......,to...", to, "..value...", value);
  const erc20Interface = new ethers.Interface([
    "function transfer(address _to, uint256 _value)",
  ]);
  const encodedData = erc20Interface.encodeFunctionData("transfer", [
    to,
    value.toString(),
  ]);
  const contractAddress = tokenAddress;
  return {
    to: contractAddress, // destination smart contract address
    data: encodedData,
    value: 0,
  };
}
