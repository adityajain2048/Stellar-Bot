import { apiCalls, loggers } from "../";
import * as redis from "../../../redis";
import * as config from "../config";

const coinPriceSyncer = async () => {
  try {
    const prices = await apiCalls.coingecko.getCoinPrices(config.coinGeckoIds);
    loggers.functions.logPrices({
      header: `💳 | PRICES`,
      prices,
      logger: loggers.logger,
    });
    await redis.setCoinPricesCache(prices);
  } catch (e: any) {
    console.log(e);
    loggers.logger.error(`🚫 | error in prices backup job`, e.message);
  }
};

export default { worker: coinPriceSyncer, cronTimer: config.cronInfo.prices };
