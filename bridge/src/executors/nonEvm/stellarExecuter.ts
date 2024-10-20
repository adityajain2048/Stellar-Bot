import * as services from "../../db/services";
import { config, loggers, utils } from "../../helpers/common";
import { big } from "../../helpers/common/utils";
import { release } from "../../helpers/stellarHelpers";
import * as redis from "../../redis";
import * as telegram from "../../helpers/common/telegram";

const stellarExecutor = async () => {
  console.log("Getting pending for stellar Executor");
  const pending = await services.bridgeTxn.getPendingBridgeTxnsWithoutToken(
    "stellar"
  );
  console.log("Pending txns of ", "stellar", " : ", pending);

  for (let p of pending) {
    try {
      // delay recently failed retries
      // const delayBy = 2 * 60 * 1000; // in ms
      const delayBy = 20 * 1000; // in ms
      // const delayBy = 0; // in ms
      if (p.retries! > 0 && Date.now() < p.updatedAt!.getTime() + delayBy)
        continue;

      loggers.functions.logTxInfo({
        header: `👷🏼 | EXECUTING`,
        tx: p,
        logger: loggers.executorLogger,
      });

      let releaseAmountInBig = utils.balanceDecimals(
        p.lockAmount,
        utils.getToken(p.fromToken, p.fromNetwork).decimals,
        utils.getToken(p.fromToken, p.toNetwork).decimals
      );
      const reducedReleaseAmount = releaseAmountInBig.mul("0.997").round(0, 0);
      let releaseAmount = utils.stringify(reducedReleaseAmount);
      if (p.toToken == "XLM") {
        // for one more decimal
        releaseAmount = releaseAmount + "0";
      }

      const sellToken = (config.nonEvmChainsInfo[
        "stellar"
      ]!.supportedTokens.find((token: any) => token.symbol == p.toToken)
        ?.address as string)
        ? (config.nonEvmChainsInfo["stellar"]!.supportedTokens.find(
            (token: any) => token.symbol == p.toToken
          )?.address as string)
        : config.nonEvmChainsInfo["stellar"]!.mainToken.symbol == p.toToken
        ? (config.nonEvmChainsInfo["stellar"]!.mainToken?.address as string)
        : "";
      if (!sellToken) {
        throw new Error(`Token for ${p.toNetwork} is not saved!`);
      }
      const txInfo: any = await release(releaseAmount, p.recipient, sellToken);
      const releaseFeeInStroop = txInfo.fee_charged.toString();
      const releaseFee = big(releaseFeeInStroop).div(big(10 ** 7));
      const prices = await redis.getCoinPricesCache();
      const releaseFeeInUsd = utils.stringify(
        releaseFee.mul(prices["stellar"])
      );
      const totalFee = big(p.lockFee).add(big(releaseFeeInUsd));
      const crossPowerBig = totalFee.mul(big(1.03)).round(2, 0);
      const crossPower = utils.stringify(crossPowerBig);

      console.log("txInfo: ", txInfo);

      const updatedTxn = await services.bridgeTxn.markProcessed(p.lockId, {
        releaseHash: txInfo.hash,
        gasAmount: txInfo.fee_charged,
        releaseFee: releaseFeeInUsd,
        crossPower,
        releaseAmount,
      });
      await telegram.notifyBridgeTxTG(updatedTxn);
      await services.crosspowerHistory.createCrosspowerHistory({
        walletAddress: p.user,
        type: "bridge",
        description: `Bridge from ${p.fromNetwork} to ${p.toNetwork}`,
        crosspower: Number(crossPower),
      });
      loggers.functions.logProcessed(p.lockHash);
    } catch (err: any) {
      await services.bridgeTxn.incrementRetries(p.lockId);
      loggers.executorLogger.error(`🚫 | error in release execution: ${err}`);
    }
  }
};

export default {
  worker: stellarExecutor,
  cronTimer: config.cronInfo.nonEvmExecutor,
};
