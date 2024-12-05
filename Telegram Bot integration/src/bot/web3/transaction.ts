import { Hex, encodeFunctionData, erc20Abi } from "viem";
import { logger } from "../../logger";
import { getSmartAccount, getVault } from "./wallet";
import { PaymasterMode, Transaction } from "@biconomy/account";

const generateTxn = (to: Hex, value: bigint, contractAddress?: Hex) => {
  try {
    let tx: Transaction;
    if (contractAddress) {
      const encodedData = encodeFunctionData({
        abi: erc20Abi,
        functionName: "transfer",
        args: [to, value],
      });
      tx = {
        to: contractAddress, // destination smart contract address
        data: encodedData,
        value: BigInt(0),
      };
    } else {
      tx = {
        to, // destination smart contract address
        data: "0x",
        value: value,
      };
    }
    return tx;
  } catch (e) {
    logger.child({ function: "generateTxn" }).error(e);
  }
};
const sendTxns = async (privateKey: Hex, txs: Transaction | Transaction[]) => {
  try {
    const vaultClient = await getVault(privateKey);
    const smartAccount = await getSmartAccount(vaultClient);
    if (!smartAccount) {
      throw new Error("Failed to create smart account");
    }
    const userOpResponse = await smartAccount.sendTransaction(
      txs
      //   {
      //   paymasterServiceData: {
      //     mode: PaymasterMode.SPONSORED
      //   }
      // }
    );
    const txnHash = await userOpResponse.waitForTxHash();
    userOpResponse.wait().then((receipt) => {
      logger.child({ function: "sendTxns" }).info(receipt);
    });
    return txnHash;
  } catch (e) {
    logger.child({ function: "sendTxn" }).error(e);
  }
};
