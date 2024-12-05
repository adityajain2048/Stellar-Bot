import { BiconomySmartAccountV2, PaymasterMode } from "@biconomy/account";

export const swapTransactionEVM = async (txs: any, keypair: any) => {
  try {
    // const provider = new ethers.JsonRpcProvider(RPC_URL);
    // // Set up your wallet
    // const wallet = new ethers.Wallet(keypair.privateKey, provider);
    // // Send the transaction
    // const response = await wallet.sendTransaction(txData?.tx);
    const smartAccount = keypair as BiconomySmartAccountV2;

    const userOpResponse = await smartAccount.sendTransaction(txs,
      {
      // paymasterServiceData: {mode: PaymasterMode.SPONSORED},
    });
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

