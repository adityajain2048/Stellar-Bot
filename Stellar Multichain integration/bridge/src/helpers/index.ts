import { config, loggers, types, utils, web3 } from "./common";
import * as db from "../db/services";
import * as redis from "../redis";
import { big } from "./common/utils";
import * as services from "../db/services";
import * as telegram from "./common/telegram";
import { ethers } from "ethers";

export const saveLockEvent = async (
  network: types.EvmChains,
  log: types.Log,
  parsedLog: any,
  bridge: any
) => {
  console.log("Save Lock Event for network: ", network);
  const fromToken = utils.getSymbolfromTokenAddress(
    network,
    parsedLog.args.destToken
  );
  const srcToken = utils.getSymbolfromTokenAddress(
    network,
    parsedLog.args.srcToken
  );
  const lockId = utils.createLockId({
    network,
    tokenSymbol: fromToken,
    transactionHash: log.transactionHash,
    logIndex: log.logIndex,
  });
  const exists = await db.bridgeTxn.bridgeTxnExists(lockId);
  if (exists) return;
  //process lock event
  const destChain = parsedLog.args.destChain as string;
  const toNetwork = web3.utils.parseBytes32String(
    destChain
  ) as types.supportedChains;
  // const user = parsedLog.args[0] as string;
  const user = parsedLog.args.user as string;
  // const amount = parsedLog.args[1] as web3.BigNumber;
  const srcAmount = parsedLog.args.inputAmount as web3.BigNumber;
  const amount = parsedLog.args.outputAmount as web3.BigNumber;
  // const username = parsedLog.args[3] as string;
  const username = parsedLog.args?.username as string;
  // const recipient = parsedLog.args?.receipent as string;
  const recipient = parsedLog.args?.recipient as string;
  console.log("toNetwork: ", toNetwork);
  console.log("parsed to token: ", parsedLog.args.toToken);
  const toToken = utils.getSymbolfromTokenAddress(
    toNetwork,
    parsedLog.args.toToken
  );
  console.log("toToken: ", toToken);
  // const lockFee = parsedLog.args?.fee as web3.BigNumber;
  const lockFee = await web3.getFeeByHash(log.transactionHash, bridge, network);

  const timestamp = await web3.getBlockTimestamp(network, log.blockNumber);
  const txn: types.IBridgeTxn = {
    lockId,
    fromNetwork: network,
    toNetwork: toNetwork,
    user,
    recipient,
    fromToken: fromToken,
    srcToken,
    lockFee: utils.stringify(lockFee),
    srcAmount: utils.stringify(srcAmount),
    //TODO: get toToken from Contract
    toToken,
    lockAmount: utils.stringify(amount),
    username,
    lockHash: log.transactionHash,
    transactionIndex: log.transactionIndex,
    logIndex: log.logIndex,
    blockNumber: log.blockNumber.toString(),
    timestamp,
    //default values
    processed: false,
    retries: 0,
  };
  console.log("txn: ", txn);
  await db.bridgeTxn.createBridgeTxn(txn);
  console.log("bridge txn saved");
  loggers.functions.logTxInfo({
    header: `💠 | EVM Lock Txn Index`,
    tx: txn,
    logger: loggers.logger,
  });
};

export const saveReleaseEvent = async (
  network: types.EvmChains,
  log: types.Log,
  parsedLog: any,
  bridge: any
) => {
  try {
    const txnHash = log.transactionHash;
    const tx = await bridge.getTransaction(txnHash);
    const receipt = await bridge.getTransactionReceipt(txnHash);

    const releaseFeeAmount = receipt.gasUsed;
    const releaseFeePrice = tx.gasPrice;
    const releaseFeeInWeth = releaseFeeAmount.mul(releaseFeePrice);
    const releaseFeeInWethBig = big(releaseFeeInWeth);
    const releaseFee = releaseFeeInWethBig.div(
      utils.stringify(
        big(10).pow(config.evmChainsInfo[network]!.mainToken.decimals)
      )
    );
    const prices = await redis.getCoinPricesCache();
    const coinGeckoId = config.evmChainsInfo[network]!.mainToken.coinGeckoId;
    const releaseFeeInUsd = utils.stringify(
      releaseFee.mul(prices[coinGeckoId])
    );
    const doc = await services.bridgeTxn.getTransactionByLockId(
      parsedLog.args.lockHash
    );
    if (!doc) {
      console.log("Transaction with given lock id not found");
      return;
    }
    const totalFee = big(doc?.lockFee.toString()!).add(big(releaseFeeInUsd));
    const crossPowerBig = totalFee.mul(1.03).round(2, 0);
    const crossPower = utils.stringify(crossPowerBig);
    // const releaseEvent = datatx.events.find(
    //   (event: any) => event.event == "Release"
    // );
    // const releaseParsed = bridge.interface.parseLog({
    //   topics: releaseEvent.topics,
    //   data: releaseEvent.data,
    // });
    const releaseAmount = ethers.BigNumber.from(parsedLog.args.outputAmount);
    const updatedTxn = await services.bridgeTxn.markProcessed(doc?.lockId!, {
      releaseHash: tx.hash,
      releaseFee: releaseFeeInUsd ? releaseFeeInUsd : undefined,
      crossPower: crossPower ? crossPower : undefined,
      gasAmount: releaseFeeAmount,
      releaseAmount: releaseAmount.toString(),
    });
    await telegram.notifyBridgeTxTG(updatedTxn);
    await services.crosspowerHistory.createCrosspowerHistory({
      walletAddress: doc.user,
      type: "bridge",
      description: `Bridge from ${doc.fromNetwork} to ${doc.toNetwork}`,
      crosspower: Number(crossPower),
    });
  } catch (err: any) {
    console.log("error when saving release log: ", err.message);
  }
};
