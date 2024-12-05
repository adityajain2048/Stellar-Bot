import { config, loggers, types, utils, web3 } from "../../helpers/common";
import * as services from "../../db/services";
import { swap as apis } from "../../apis";
// import { stringify } from "../../packages/common/src/utils";
import { ethers } from "ethers";
import * as redis from "../../redis";
import { big } from "../../helpers/common/utils";
import * as telegram from "../../helpers/common/telegram";

const evmExecutor = async () => {
  for (const network of config.evmChains) {
    console.log("Executing for network: ", network);
    // const tokens = config.evmChainsInfo[network]!.supportedTokens
    // tokens.unshift(config.evmChainsInfo[network]!.mainToken)
    // const tokens = {...config.evmChainsInfo[network]!.supportedTokens, config.evmChainsInfo[network]!.mainToken}
    // for (const token of tokens) {
    // const pending = await services.bridgeTxn.getPendingBridgeTxns(
    //   network,
    //   token.symbol,
    // );
    const pending = await services.bridgeTxn.getPendingBridgeTxnsWithoutToken(
      network
    );
    console.log("Pending txns of ", network, " : ", pending);
    const bridge: any = await web3.getBridgeInstance(network);
    for (const p of pending) {
      try {
        // delay recently failed retries
        // const delayBy = 2 * 60 * 1000; // in ms
        // if (p.retries! > 0 && Date.now() < p.updatedAt!.getTime() + delayBy)
        //   continue;

        // loggers.functions.logTxInfo({
        //   header: `👷🏼 | EXECUTING`,
        //   tx: p,
        //   logger: loggers.executorLogger,
        // });

        // prevent double spending
        // const processed = await bridge.processed(p.lockId);
        // if (processed) {
        //     const remark = utils.REMARKS.ALREADY_PROCESSED;
        //     await db.markRemarks(p.lockId, remark);
        //     utils.logRemark(remark, loggers.executor);
        //     await tg.notifyBridgeTxTGRemark(p, remark);
        //     continue;
        // }
        //

        // cross chain decimal balanced accounting

        // let releaseAmount = utils.balanceDecimals(p.outputAmount, fromConfig.decimals, toConfig.decimals);
        let releaseAmount = utils.balanceDecimals(
          p.lockAmount,
          utils.getToken(p.fromToken, p.fromNetwork).decimals,
          utils.getToken(p.fromToken, p.toNetwork).decimals
        );
        let sellToken;
        if (p.fromNetwork == "stellar") {
          // releaseAmount = big(p.lockAmount);
          sellToken = config.evmChainsInfo[p.toNetwork]!.supportedTokens.find(
            (token) => token.symbol == p.fromToken
          )?.address as string;
        } else {
          releaseAmount = utils.balanceDecimals(
            p.lockAmount,
            utils.getToken(p.fromToken, p.fromNetwork).decimals,
            utils.getToken(p.fromToken, p.toNetwork).decimals
          );
          sellToken = config.evmChainsInfo[p.toNetwork]!.supportedTokens.find(
            (token) => token.symbol == p.fromToken
          )?.address as string;
        }
        console.log("Release Amount: ", releaseAmount);

        const buyToken = (config.evmChainsInfo[
          p.toNetwork
        ]!.supportedTokens.find((token) => token.symbol == p.toToken)
          ?.address as string)
          ? (config.evmChainsInfo[p.toNetwork]!.supportedTokens.find(
              (token) => token.symbol == p.toToken
            )?.address as string)
          : config.evmChainsInfo[p.toNetwork]!.mainToken.symbol == p.toToken
          ? config.evmChainsInfo[p.toNetwork]!.mainToken.address
          : ("" as string);

        console.log("Buy Token: ", buyToken);
        // generate swap calldata: usd -> to token (sell amount pre fee)
        console.log(
          "Sell token: ",
          config.evmChainsInfo[p.toNetwork]!.supportedTokens.find(
            (token) => token.symbol == p.fromToken
          )?.address
        );
        let swapData = await apis.get0xSwapData({
          sellToken,
          buyToken,
          sellAmount: utils.stringify(releaseAmount),
          chainId: network,
        });

        const tokenBridge: any = web3.getErc20BridgeInstance(
          p.toNetwork as any,
          p.fromToken
        );

        const intermediateToken = utils.getToken(p.fromToken, p.toNetwork);
        console.log("Intermediate: ", intermediateToken);
        // const allowanceAmount = web3.parseUnits(stringify(releaseAmount.mul(1.05).round(0,0)),intermediateToken.decimals)
        const allowanceAmount = web3.parseUnits(
          utils.stringify(releaseAmount.mul(1.05).round(0, 0).toString()),
          0
        );
        // const allowanceAmount = ethers.BigNumber.from(releaseAmount);
        console.log("allowanceAmount: ", allowanceAmount.toString());
        // const allowanceAmount = stringify(releaseAmount.mul(1.05).round(0,0))

        const spenderAddress = config.evmChainsInfo[p.toNetwork]!.bridgeAddress;
        console.log("Spender address: ", spenderAddress);

        const adminWalletAddress = utils.getEnvVar("ADMIN_ADDRESS");
        console.log("adminWalletAddress: ", adminWalletAddress);

        const bridgeAllowance = await tokenBridge.allowance(
          adminWalletAddress,
          spenderAddress
        );
        console.log("bridgeAllowance type: ", typeof bridgeAllowance);
        console.log("Bridge Allowance: ", bridgeAllowance.toString());

        // let bridgeApproval
        // if(!bridgeAllowance.gt(0) || bridgeAllowance.lt(allowanceAmount)){
        //   bridgeApproval = await tokenBridge.approve(spenderAddress, allowanceAmount,{gasLimit: 1000000})
        // }
        //

        if (bridgeAllowance.lt(allowanceAmount)) {
          // Estimate the gas limit for the approval transaction
          const gasEstimateApproval = await tokenBridge.estimateGas.approve(
            spenderAddress,
            allowanceAmount
          );
          console.log("gasEstimateApproval: ", gasEstimateApproval);

          // Get current gas price
          const gasPriceApproval = await tokenBridge?.provider?.getGasPrice();
          console.log("gasPriceApproval: ", gasPriceApproval);

          // Check the balance of the owner address
          const balanceApproval = await tokenBridge?.provider?.getBalance(
            adminWalletAddress
          );
          console.log("balanceApproval: ", balanceApproval);

          // Calculate the total gas cost
          const totalGasCostApproval =
            gasEstimateApproval.mul(gasPriceApproval);

          console.log("totalGasCostApproval: ", totalGasCostApproval);
          if (balanceApproval.lt(totalGasCostApproval)) {
            throw new Error("Insufficient funds for gas * price + value");
          }

          const approveTx = await tokenBridge?.approve(
            spenderAddress,
            allowanceAmount,
            {
              gasLimit: gasEstimateApproval.add(ethers.BigNumber.from("10000")), // Adding a buffer to the estimated gas limit
              gasPrice: gasPriceApproval,
            }
          );

          console.log("Approve Tx: ", approveTx);

          // Wait for the transaction to be mined
          await approveTx.wait();
        }

        const gasUnits = await bridge.estimateGas.release(
          swapData,
          p.recipient,
          p.lockId,
          {
            gasLimit: 10000000,
          }
        );
        console.log("Gas Units: ", gasUnits);
        // const gasUnits = "388027"

        const gasPrice = await web3.getFastGasPrice(network);
        // const gasPrice = "4146163631"

        const gasCost = utils.big(gasUnits).mul(gasPrice);

        const gasAmount = await utils.calcGasCostInToken(
          //gas amount in to token
          network,
          gasCost,
          config.evmChainsInfo[p.toNetwork]!.supportedTokens.find(
            (token: any) => p.fromToken == token.symbol
          )!.symbol
        );
        console.log("Gas Amount: ", gasAmount.toString());
        releaseAmount = releaseAmount.sub(gasAmount); // deduct fee

        // utils.logFees({ releaseAmount: utils.stringify(releaseAmount), gasAmount, network });
        // loggers.functions.logFees({
        //   gas: gasAmount,
        //   commission: '',
        //   releaseAmount: utils.stringify(releaseAmount),
        //   network: p.toNetwork,
        //   tokenSymbol: token.symbol,
        // });
        //

        // release amount is enough
        // if (releaseAmount.lt(0)) {
        //     const remark = utils.REMARKS.INSUFFICIENT_AMOUNT;
        //     await db.markRemarks(p.lockId, remark);
        //     utils.logRemark(remark, loggers.executor);
        //     await tg.notifyBridgeTxTGRemark(p, remark);
        //     continue;
        // }
        if (releaseAmount.lt(0)) {
          const remark = config.remarks.INSUFFICIENT_AMOUNT;
          await services.bridgeTxn.markRemarks(p.lockId, remark);
          loggers.functions.logRemark(remark, loggers.executorLogger);
          // await telegram.notifyBridgeTxTGRemark(p, remark, token.symbol);
          continue;
        }

        // generate swap calldata: usd -> to token (sell amount post fee)
        swapData = await apis.get0xSwapData({
          sellToken,
          buyToken,
          sellAmount: utils.stringify(releaseAmount),
          chainId: network,
        });
        // loggers.executor.info(`> expected   = ${swapData.quote} TOKEN`);

        // release

        const tx = await bridge.release(swapData, p.recipient, p.lockId, {
          gasPrice: await web3.getFastGasPrice(network, 1.1),
          type: 0,
        });

        const releaseTime = utils.now() - p.timestamp;
        // await telegram.notifyBridgeTxTG(
        //   p,
        //   releaseTime,
        //   token.symbol
        // );
        await services.bridgeTxn.markProcessed(p.lockId, {
          releaseHash: tx.hash,
          // releaseFee: releaseFeeInUsd ? releaseFeeInUsd : undefined,
          // crossPower: crossPower ? crossPower : undefined,
          gasAmount,
          // releaseAmount: utils.stringify(releaseParsed.args.outputAmount),
        });
        await tx.wait();
        console.log("Final Txn saved");
      } catch (err: any) {
        await services.bridgeTxn.incrementRetries(p.lockId);
        loggers.executorLogger.error(`🚫 | error in release execution: ${err}`);

        // loggers.executor.error(`error in release`, err.message);
        // await telegram.notifyBridgeTxTGRemark(p, `error in release`, token.symbol);

        /* eslint-enable */
      }
    }
  }
  // for (const token of config.evmChainsInfo[network].supportedTokens) {
  //   const pendingTxns = await db.services.bridgeTxn.getPendingBridgeTxns(
  //     network,
  //     token.symbol
  //   );
  //   const bridge = web3.getBridgeInstance(network, token.symbol);
  //   const batch: types.IBridgeTxn[] = [];
  //   let gas = ""; //cache
  //   //create batch of txns
  //   for (const txn of pendingTxns) {
  //     try {
  //       loggers.functions.logTxInfo({
  //         header: `👷🏼 | EXECUTING`,
  //         tx: txn,
  //         logger: loggers.executorLogger,
  //       });

  //       //prevent double spending
  //       const processed = await bridge.processed(txn.lockId);
  //       if (processed) {
  //         const remark = config.remarks.ALREADY_PROCESSED;
  //         await db.services.bridgeTxn.markProcessed(txn.lockId, {
  //           remarks: remark,
  //         });
  //         loggers.functions.logRemark(remark, loggers.executorLogger);
  // await telegram.notifyBridgeTxTGRemark(txn, remark, token.symbol);
  //         continue;
  //       }

  //       //validate User
  //       if (!web3.utils.isAddress(txn.username ? txn.username : txn.user)) {
  //         const remark = config.remarks.INVALID_USERNAME;
  //         await db.services.bridgeTxn.markRemarks(txn.lockId, remark);
  //         loggers.functions.logRemark(remark, loggers.executorLogger);
  // await telegram.notifyBridgeTxTGRemark(txn, remark, token.symbol);
  //         continue;
  //       }

  //       //cross Chain decimal balanced accounting
  //   //     let releaseAmount = utils.balanceDecimals(
  //   //       txn.lockAmount,
  //   //       utils.getToken(txn.fromToken, txn.fromNetwork).decimals,
  //   //       token.decimals
  //   //     );

  //   //     gas = "0"; //temp
  //   //     if (!gas) {
  //   //       //gas = (commission + gas)
  //   //       const gasUnits: any = await bridge.estimateGas.releaseTokens?.(
  //   //         txn.username,
  //   //         utils.stringify(releaseAmount),
  //   //         txn.lockId
  //   //       );
  //   //

  //   //       const gasPrice = await web3.getFastGasPrice(
  //   //         txn.toNetwork as types.EvmChains
  //   //       );
  //   //       const gasCost = utils.big(gasUnits).mul(gasPrice);
  //   //       gas = await web3.calcGasCostInToken(txn.toNetwork, token, gasCost);
  //   //     }
  //   //     const commission = web3.calcCommission(releaseAmount);
  //   //     releaseAmount = releaseAmount.sub(commission).sub(gas);
  //   //     loggers.functions.logFees({
  //   //       gas,
  //   //       commission,
  //   //       releaseAmount: utils.stringify(releaseAmount),
  //   //       network: txn.toNetwork,
  //   //       tokenSymbol: token.symbol,
  //   //     });

  //   //     // check if release amount is enough
  //   //     if (releaseAmount.lt(0)) {
  //   //       const remark = config.remarks.INSUFFICIENT_AMOUNT;
  //   //       await db.services.bridgeTxn.markRemarks(txn.lockId, remark);
  //   //       loggers.functions.logRemark(remark, loggers.executorLogger);
  //       await telegram.notifyBridgeTxTGRemark(txn, remark, token.symbol);
  //   //       continue;
  //   //     }

  //   //     //push to execution batch
  //   //     batch.push(txn);
  //   //   } catch (err: any) {
  //   //
  //   //     const errorText = "error in batch picking";
  //   //     loggers.executorLogger.error(`🚫 | ${errorText}: ${err}`);
  //   //     await db.services.bridgeTxn.markRemarks(txn.lockId, errorText);
  //     await telegram.notifyBridgeTxTGRemark(txn, errorText, token.symbol);
  //   //   }
  //   // }

  //   // //execute batch
  //   // try {
  //   //   if (batch.length === 0) continue;
  //   //   const users = batch.map((txn) => txn.username);
  //   //   const amounts = batch.map((txn) => txn.lockAmount);
  //   //   const lockIds = batch.map((txn) => txn.lockId);

  //   //   const gasPrice = await web3.getFastGasPrice(
  //   //     batch[0]?.toNetwork as types.EvmChains,
  //   //     1.1
  //   //   );
  //   //   const batchTxn = await bridge.releaseTokensBatch(
  //   //     users,
  //   //     amounts,
  //   //     lockIds,
  //   //     {
  //   //       gasPrice,
  //   //       type: 0,
  //   //     }
  //   //   );
  //   //   await batchTxn.wait();

  //   //   //update db
  //   //   for (const txn of batch) {
  //   //     await db.services.bridgeTxn.markProcessed(txn.lockId, {
  //   //       releaseHash: batchTxn.hash,
  //   //     });
  //   //     loggers.functions.logProcessed(batchTxn.hash);
  //     await telegram.notifyBridgeTxTG(
  //   //       txn,
  //   //       utils.now() - txn.timestamp,
  //   //       token.symbol
  //   //     );
  //   //   }
  //   } catch (err) {
  //
  //     loggers.executorLogger.error(`🚫 | error in batch execution: ${err}`);
  //   }
  // }
  // }
};

export default { worker: evmExecutor, cronTimer: config.cronInfo.evmExecutor };
