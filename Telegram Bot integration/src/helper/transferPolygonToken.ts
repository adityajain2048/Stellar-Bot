import { BiconomySmartAccountV2, PaymasterMode } from "@biconomy/account";
import { BigNumberish, ethers } from "ethers";

export const transferPolygonTokenWebApp = async (
  amount: number,
  receiverAddress: string,
  tokenAddress: string,
  keypair: any
) => {
  try {
    console.log(
      "inside transferPolygonTokenWebApp....",
      amount,
      receiverAddress,
      tokenAddress
    );
    if (ethers.isAddress(receiverAddress)) {
      const isNative =
        tokenAddress?.toLowerCase() ===
        "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
          ? true
          : false;
      const smartWallet = keypair as BiconomySmartAccountV2;
      const txnStatus = await sendTransaction(
        smartWallet,
        ethers.parseEther(amount.toString()),
        receiverAddress,
        tokenAddress,
        "",
        isNative
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
  tokenAddress: string,
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
      const contractAddress = tokenAddress;
      tx = {
        to: contractAddress, // destination smart contract address
        data: encodedData,
      };
    }
    const userOpResponse = await smartAccount.sendTransaction(tx, 
    //   {
    //   paymasterServiceData: { mode: PaymasterMode.SPONSORED },
    // }
    );
    const { transactionHash } = await userOpResponse.waitForTxHash();
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
    console.log(err);
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
