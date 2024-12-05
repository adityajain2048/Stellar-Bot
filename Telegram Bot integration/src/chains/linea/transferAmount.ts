import { BigNumberish, ethers } from "ethers";
import { BiconomySmartAccountV2, PaymasterMode } from "@biconomy/account";

export const transferAmount = async (
  params: any,
  keypair: any,
  chatId: number,
  isMatic: boolean
) => {
  try {
    // const userContext = userContexts.get(chatId);
    // // reselt trackObject
    // userContext.trackObject.functionName = null;
    // userContext.trackObject.functionParams = null;
    // userContext.trackObject.lastParamIndex = 0;
    // userContext.trackObject.totalParams = null;
    // userContext.currentMsgToParams = {};
    // userContext.tokensBuySell = { coinTypeA: "", coinTypeB: "" };
    // userContext.transferTokenName = "";

    if (isMatic) {
      return await transferMatic(
        params.amount,
        params.receiverAddress,
        keypair
      );
    } else {
      return await transferERC20(
        params.amount,
        params.receiverAddress,
        keypair
      );
    }
  } catch (error) {
    console.log("Error in transfering amount..............", error);
  }
};

const transferMatic = async (amount:number, recieverAddress:string, keypair: any) => {
  try {
    if (ethers.isAddress(recieverAddress)) {
      const smartWallet = keypair as BiconomySmartAccountV2;
      const txnStatus = await sendTransaction(
        smartWallet,
        ethers.parseEther(amount.toString()),
        recieverAddress,
        "",
        true
      );
      return txnStatus;
    }
  } catch (error) {
    console.log("Error in transfering Matic..............", error);
    return { response: { status: false, message: "Transaction failed" } };
  }
};

const transferERC20 = async (amount:number, recieverAddress:string, keypair: any) => {
  try {
    if (ethers.isAddress(recieverAddress)) {
      const smartWallet = keypair as BiconomySmartAccountV2;
      const txnStatus = await sendTransaction(
        smartWallet,
        ethers.parseEther(amount.toString()),
        recieverAddress,
        "",
        false
      );
      return txnStatus;
    }
  } catch (error) {
    console.log("Error in transfering ERC20..............", error);
    return { response: { status: false, message: "Transaction failed" } };
  }
};

export const sendTransaction = async (
  smartAccount: BiconomySmartAccountV2,
  value: number | BigNumberish,
  to: string,
  data?: string,
  isNative?: boolean
) => {
  try {
    let tx;
    if (isNative) {
      tx = {
        to: to,
        data: data !== undefined ? data : "0x",
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
      const contractAddress = to;
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
    const { transactionHash } = await userOpResponse.waitForTxHash();
    console.log("Transaction Hash", transactionHash);
    const userOpReceipt = await userOpResponse.wait();
    console.log("UserOp receipt", userOpReceipt);
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
    console.log(err);
  }
};

export function getTransferTx(to: string, value: number, fromTokenInfo: any) {
  console.log("inside getTransferTx....", to, value);
  const erc20Interface = new ethers.Interface([
    "function transfer(address _to, uint256 _value)",
  ]);
  const encodedData = erc20Interface.encodeFunctionData("transfer", [
    to,
    value.toString(),
  ]);
  const contractAddress = fromTokenInfo.address;
  return {
    to: contractAddress, // destination smart contract address
    data: encodedData,
    value: 0,
  };
}

export const getTransferTxOfERC20 = (
  to: string,
  value: number,
  tokenAddress: string
) => {
  try {
    console.log(
      "inside getTransferTxOfERC20...............",
      to,
      value,
      tokenAddress
    );
    const erc20Interface = new ethers.Interface([
      "function transfer(address _to, uint256 _value)",
    ]);
    const encodedData = erc20Interface.encodeFunctionData("transfer", [
      to,
      "" + value,
    ]);
    const contractAddress = tokenAddress;
    return {
      to: contractAddress, // destination smart contract address
      data: encodedData,
      value: "" + 0,
    };
  } catch (error) {
    console.log("inside getTransferTxOfERC20...............error", error);
  }
};
