import * as redis from "redis";
import { types } from "../helpers/common";

export * from "./evm";
export const instance = redis.createClient({ url: process.env.REDIS_URL });

export const connect = async (): Promise<void> => {
  await instance.connect().then(async () => {
    console.log("Connected to redis");
  });
};

export const getNamespacedKey = (...namespaces: string[]): string => {
  return namespaces.join(`:`);
};

export const getCoinPricesCache = async (): Promise<Record<string, string>> => {
  const data = await instance.hGetAll(types.CacheKeys.PRICES);
  return data as Record<string, string>;
};

export const setCoinPricesCache = async (
  prices: types.PricesCache
): Promise<void> => {
  await instance.hSet(types.CacheKeys.PRICES, prices);
};
