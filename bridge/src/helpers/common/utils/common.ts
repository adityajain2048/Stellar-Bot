import "dotenv/config";
import Big from "big.js";
import * as packageTypes from "../types";
import * as utils from ".";
import * as redis from "../../../redis";
import * as config from "../config/chains";
import { types } from "..";

export const getEnvVar = (varName: string): string => {
  const val = process.env[varName];
  if (!val) throw `env var ${varName} not found`;
  return val;
};

export const shortAddr = (addr: string): string => {
  return `${addr.slice(0, 5)}...${addr.slice(-5)}`;
};

export const createLockId = (params: {
  network: types.supportedChains;
  tokenSymbol: string;
  transactionHash: string;
  logIndex?: number;
}): string => {
  return [
    params.network,
    params.tokenSymbol,
    params.transactionHash,
    params.logIndex,
  ]
    .filter((_) => _)
    .join(`:`);
};

export const now = () => Math.floor(Date.now() / 1000);

export const sleep = async (secs: number) => {
  await new Promise((r) => setTimeout(r, secs * 1000));
};

export const calcGasCostInToken = async (
  network: packageTypes.EvmChains,
  gasCost: Big,
  symbol: string
): Promise<string> => {
  // const { decimals, coingeckoId } = config.evmChainsInfo[network].mainToken;
  const token = config.evmChainsInfo[network]!.supportedTokens.find(
    (token) => token.symbol == symbol
  );
  let decimals;
  let coingeckoId;
  if (token) {
    decimals = token?.decimals;
    coingeckoId = token?.coinGeckoId;
  } else {
    decimals = config.evmChainsInfo[network]!.mainToken.decimals;
    coingeckoId = config.evmChainsInfo[network]!.mainToken.coinGeckoId;
  }

  console.log("Calculating gas amount decimals: " + decimals);
  console.log("Calculating gas amount coingeckoId: " + coingeckoId);
  const prices: any = await redis.getCoinPricesCache();
  console.log("Price in calGasCostInToken: ", prices);
  console.log("Gas Cost fromWei: " + utils.fromWei(gasCost));
  return (
    utils
      .fromWei(gasCost)
      // Change it for mainnet
      .mul(prices[coingeckoId])
      .mul(10 ** decimals)
      .toFixed(0, 0)
  );
};

export const REMARKS = {
  INVALID_USERNAME: `INVALID_USERNAME`,
  ALREADY_PROCESSED: `ALREADY_PROCESSED`,
  INSUFFICIENT_AMOUNT: `INSUFFICIENT_AMOUNT`,
};
