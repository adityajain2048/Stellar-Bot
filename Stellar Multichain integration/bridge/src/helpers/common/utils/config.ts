import * as types from "../types";
import * as config from "../config";
import { symbol } from "zod";

export const getConfig = (network: types.supportedChains) => {
  return config.allChainsInfo[network];
};

export const getTokenDecimals = (network: types.supportedChains): number => {
  return getConfig(network)!.mainToken.decimals;
};

export const getSymbolfromTokenAddress = (
  network: types.supportedChains,
  tokenAddress: string
): string => {
  const tokenInfo = getTokenInfo(network, tokenAddress);
  return tokenInfo.symbol;
};

export const getTokenInfo = (
  network: types.supportedChains,
  tokenAddress: string
): types.TokenInfo => {
  let tokenInfo: any = config.allChainsInfo[network]!.supportedTokens.find(
    (token: any) => token.address.toLowerCase() === tokenAddress.toLowerCase()
  );
  console.log(
    "Main Token Address: ",
    config.allChainsInfo[network]!.mainToken.address
  );
  console.log("Token Address: ", tokenAddress);
  if (
    !tokenInfo &&
    config.allChainsInfo[network]!.mainToken.address.toLowerCase() ===
      tokenAddress.toLowerCase()
  ) {
    tokenInfo = config.allChainsInfo[network]!.mainToken;
  }
  if (!tokenInfo) throw new Error(`Token not found for ${tokenAddress}`);
  return tokenInfo;
};

export const getToken = (symbol: string, network: types.supportedChains) => {
  const tokenInfo = config.allChainsInfo[network]!.supportedTokens.find(
    (token: any) => token.symbol === symbol
  );
  if (!tokenInfo) throw new Error(`Token not found for ${symbol}`);
  return tokenInfo;
};
