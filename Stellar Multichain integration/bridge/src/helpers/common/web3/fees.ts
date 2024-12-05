import { getProvider } from ".";
import { config, types, utils } from "..";
import * as redis from "../../../redis";

export const calcCommission = (amount: Big, decimals = 0): string => {
  return amount.mul(config.COMMISSION_PERCENT).div(100).toFixed(decimals, 0);
};

export const calcBridgeFees = async (params: {
  network: types.supportedChains;
  token: types.Token;
  gasCost: Big;
  amount: Big;
}): Promise<{ gas: string; commission: string }> => {
  const gas = await calcGasCostInToken(
    params.network,
    params.token,
    params.gasCost
  );
  const commission = calcCommission(params.amount);
  return { gas, commission };
};
export const getFastGasPrice = async (
  network: types.EvmChains,
  multiplier = 1.2
): Promise<string> => {
  const provider = getProvider(network);
  const gasPrice = await provider.getGasPrice();
  return utils.big(gasPrice).mul(multiplier).toFixed(0, 0);
};

export const calcGasCostInToken = async (
  network: types.supportedChains,
  token: types.Token,
  gasCost: Big
): Promise<string> => {
  const {
    mainToken: { coinGeckoId: networkCoingeckoId, decimals: networkDecimals },
  } = config.allChainsInfo[network]!;
  const { coinGeckoId: tokenCoingeckoId, decimals: tokenDecimals } = token;
  const prices = await redis.getCoinPricesCache();
  return utils
    .fromWei(gasCost, networkDecimals)
    .mul(prices[networkCoingeckoId]!)
    .div(prices[tokenCoingeckoId]!)
    .mul(10 ** tokenDecimals)
    .toFixed(0, 0);
};
