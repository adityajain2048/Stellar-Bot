import { BiconomySmartAccountV2, PaymasterMode } from "@biconomy/account";
import { writeToFile } from "./writeInFile";

export const swapTransactionEVM = async (txs: any, keypair: any) => {
  try {
    const smartAccount = keypair as BiconomySmartAccountV2;
    const userOpResponse = await smartAccount.sendTransaction(txs, 
    //     {
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
    return { response: { status: false, message: "Swap Transactions failed" } };
  } catch (err) {
    console.log("error in swapTransactionEVM: ", err);
    return {
      response: { status: false, message: "Swap Transactions failed" },
    };
  }
};
