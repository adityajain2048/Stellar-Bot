import Big from "big.js";
import * as types from "../types";
import * as utils from ".";
import * as redis from "../../../redis";
import * as config from "../config/chains";

export const createLockId = (params: {
  network: types.EvmChains;
  transactionHash: string;
  logIndex: number;
}): string => {
  return [params.network, params.transactionHash, params.logIndex].join(`:`);
};

// export const calcGasCostInToken = async (
//   network: types.EvmChains,
//   gasCost: Big,
//   symbol: string,
// ): Promise<string> => {
//   const { decimals, coingeckoId } = config.evmChainsInfo[network];
//   console.log("Calculating gas amount decimals: " + decimals);
//   console.log("Calculating gas amount coingeckoId: " + coingeckoId);
//   const prices = await redis.getCoinPrices();
//   console.log("Price in calGasCostInToken: ", prices);
//   console.log("Gas Cost fromWei: " + utils.fromWei(gasCost));
//   return utils
//     .fromWei(gasCost)
//     .mul(prices[coingeckoId])
//     .mul(10 ** decimals)
//     .toFixed(0, 0);
// };

export const REMARKS = {
  INVALID_USERNAME: `INVALID_USERNAME`,
  ALREADY_PROCESSED: `ALREADY_PROCESSED`,
  INSUFFICIENT_AMOUNT: `INSUFFICIENT_AMOUNT`,
};
