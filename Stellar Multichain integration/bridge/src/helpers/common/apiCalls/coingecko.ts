import axios from "axios";
import * as utils from "../utils";
import * as types from "../types";

// export const COINGECKO_BASE_URL = utils.getEnvVar(`COINGECKO_API_BASE_URL`);
export const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";
const coinIds = ["stellar", "ethereum", "tezos", "matic-network", "dogami"];

export type PriceCache = { [coinId in (typeof coinIds)[number]]: string };

export const getCoinPrices = async (
  coinIdsArray: string[] = coinIds
): Promise<PriceCache> => {
  console.log(coinIdsArray);
  const url = `${COINGECKO_BASE_URL}/simple/price`;
  const params = { ids: coinIdsArray.join(`,`), vs_currencies: `usd` };
  const res = await axios.get<types.CoingeckoPriceResponse>(url, { params });
  return Object.fromEntries(
    Object.entries(res.data).map((e) => [e[0], utils.stringify(e[1].usd)])
  ) as PriceCache;
};
