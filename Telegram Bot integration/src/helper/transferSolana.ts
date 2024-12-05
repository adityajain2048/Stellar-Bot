import solanaWeb3, { Connection, PublicKey } from "@solana/web3.js";
export const transferSolanaToken = async (
  amount: number,
  receiverAddress: string,
  walletKeyPair: any,
) => {
  try {
    const rpcUrl = process.env.RPC_URL || "https://api.mainnet-beta.solana.com";
    const connection = new Connection(rpcUrl);
    const transaction = new solanaWeb3.Transaction().add(
      solanaWeb3.SystemProgram.transfer({
        fromPubkey: new PublicKey("FoCz21iVgxFrjsQhkQN9usRZYJBafBs5B2XYdejYmDyL"),
        toPubkey: new PublicKey(receiverAddress),
        lamports: solanaWeb3.LAMPORTS_PER_SOL * amount,
      })
    );
    const signature = await solanaWeb3.sendAndConfirmTransaction(
        connection,
        transaction,
        [walletKeyPair],
     );

     console.log("Transaction Signature:", signature);
  } catch (error) {
    console.log("Error in transfering Solana..............", error);
  }
};
