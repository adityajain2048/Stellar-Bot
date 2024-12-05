import { logger, executorLogger } from ".";
import { types } from "..";
import * as utils from "../utils";
import { IBridgeTxn } from "../../../db/models/bridgeTxnsModel";

export const logTxInfo = (params: {
  tx: IBridgeTxn;
  logger: types.loggerTypes.Logger;
  header?: string;
}) => {
  const { tx, logger, header } = params;
  if (header) logger.info(header);
  logger.info(`> id = ${tx.lockId}`);
  logger.info(
    `> path = ${tx.fromNetwork.toUpperCase()} 👉 ${tx.toNetwork.toUpperCase()}`
  );
  logger.info(`> user = ${tx.user} `);
  logger.info(
    `> amount     =  ${utils.fromWeiStr(
      tx.lockAmount!,
      utils.getTokenDecimals(tx.fromNetwork)
    )} $DOGA`
  );
};

export const logRemark = (remark: string, logger: types.loggerTypes.Logger) => {
  logger.info(`❗ | remark = ${remark}`);
};

export const logProcessed = (releaseHash: string) => {
  executorLogger.info(`✅ | released | hash = ${releaseHash}`);
};

export const logFees = (params: {
  gas: string;
  commission: string;
  releaseAmount: string;
  network: types.supportedChains;
  tokenSymbol: string;
}) => {
  const { gas, commission, releaseAmount, network } = params;
  const decimals = utils.getTokenDecimals(network);
  executorLogger.info(
    `> commission = -${utils.fromWeiStr(commission, decimals)} $${
      params.tokenSymbol
    }`
  );
  executorLogger.info(
    `> gas        = -${utils.fromWeiStr(gas, decimals)} $${params.tokenSymbol}`
  );
  executorLogger.info(
    `> net amount =  ${utils.fromWeiStr(releaseAmount, decimals)} $DOGA`
  );
};

export const logPrices = (params: {
  header?: string;
  prices: types.PricesCache;
  logger: types.loggerTypes.Logger;
}) => {
  const { header, prices, logger } = params;
  if (header) logger.info(header);
  Object.keys(prices).map((c) => logger.info(`> 1 $${c} = $${prices[c]}`));
};
