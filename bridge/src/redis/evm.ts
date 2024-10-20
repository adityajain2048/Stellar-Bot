import { config, types, utils } from "../helpers/common";
import { getNamespacedKey, instance } from ".";

export const setLastSyncBlockNumber = async (
  network: types.supportedChains,
  event: string,
  blockNumber: number,
  token?: types.Token
): Promise<void> => {
  let key: string;
  if (token) {
    key = getNamespacedKey(
      network,
      event,
      token?.symbol.toLowerCase(),
      types.CacheKeys.LAST_SYNC_BLOCK_NUMBER
    );
  } else {
    if (event == "Release") {
      key = getNamespacedKey(
        network,
        event,
        types.CacheKeys.LAST_SYNC_BLOCK_NUMBER
      );
    } else {
      key = getNamespacedKey(network, types.CacheKeys.LAST_SYNC_BLOCK_NUMBER);
    }
  }
  await instance.set(key, utils.stringify(blockNumber));
};

export const getLastSyncBlockNumber = async (
  network: types.supportedChains,
  event: string,
  token?: types.Token
): Promise<number> => {
  let key: string;
  if (token) {
    key = getNamespacedKey(
      network,
      event,
      token?.symbol.toLowerCase(),
      types.CacheKeys.LAST_SYNC_BLOCK_NUMBER
    );
  } else {
    console.log("event: ", event);
    if (event == "Release") {
      key = getNamespacedKey(
        network,
        event,
        types.CacheKeys.LAST_SYNC_BLOCK_NUMBER
      );
      console.log("key: ", key);
    } else {
      key = getNamespacedKey(network, types.CacheKeys.LAST_SYNC_BLOCK_NUMBER);
    }
  }
  const blockNumber = await instance.get(key);
  console.log("blockNumber: ", blockNumber);
  if (!blockNumber) {
    if (token) {
      return token.bridgeDeployBlock!;
    }
    if (network == "stellar") {
      return config.nonEvmChainsInfo["stellar"]!.bridgeDeployLedger;
    }
    return config.evmChainsInfo[network]!.bridgeDeployBlock;
  }
  return +blockNumber;
};
