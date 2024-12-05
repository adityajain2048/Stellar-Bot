import { createHash } from "crypto";
import { config } from "../../config";
import { logger } from "../../logger";
import { Hex, WalletClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { polygon } from "viem/chains";
import { linea } from "viem/chains";
import { RPC_URLS } from "./config";
import { createSmartAccountClient } from "@biconomy/account";
import { CHAIN_NAME } from "../../config/config";

export const generatePrivateKey = (telegramId: string) => {
  const source = telegramId + config.SECRET_KEY;
  const hash = createHash("sha256").update(source).digest("hex");
  const privateKey: Hex = `0x${hash.slice(-64).padStart(64, "0")}`;
  return privateKey;
};

export const getVault = async (privatekey: Hex) => {
  const vault = privateKeyToAccount(privatekey);
  const vaultClient = createWalletClient({
    account: vault,
    chain: linea,
    transport: http(RPC_URLS[CHAIN_NAME as keyof typeof RPC_URLS]),
  });
  return vaultClient;
};

export const getSmartAccount = async (vaultClient: WalletClient) => {
  try {
    const smartAccount = await createSmartAccountClient({
      signer: vaultClient,
      bundlerUrl: config.BUNDLER_URL,
      biconomyPaymasterApiKey: config.PAYMASTER_API_KEY,
    });
    return smartAccount;
  } catch (e) {
    logger.child({ function: "getSmartAccount" }).error(e);
  }
};

export const createWallets = async (privatekey: Hex) => {
  try {
    const vaultClient = await getVault(privatekey);
    const vaultAddress = vaultClient?.account.address;

    const smartAccount = await getSmartAccount(vaultClient);
    if (!smartAccount) {
      throw new Error("Failed to create smart account");
    }
    const smartAccountAddress = await smartAccount.getAddress();
    return {
      vaultAddress,
      smartAccountAddress,
      smartAccount,
    };
  } catch (e) {
    logger.child({ function: "createWallets" }).error(e);
  }
};
