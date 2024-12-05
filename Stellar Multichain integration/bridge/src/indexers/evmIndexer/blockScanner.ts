import { config, loggers, web3, types } from "../../helpers/common";
import * as redis from "../../redis";
import { saveLockEvent } from "../../helpers";

const evmBlockScanner = async () => {
  try {
    const networkTasks = config.evmChains.map(async (network) => {
      try {
        // Recheck missed Lock Events on common Bridge
        console.log("Getting logs for evmBlockScanner: ", network);

        const fromBlockNumber = await redis.getLastSyncBlockNumber(
          network,
          config.events.evm
        );
        console.log("From Block: ", fromBlockNumber);

        const toBlockNumber = await web3.getLatestBlockNumber(network);
        console.log("To block: ", toBlockNumber);

        if (fromBlockNumber == toBlockNumber) {
          console.log(`No new blocks for network: ${network}`);
          return;
        }

        const bridge = await web3.getBridgeInstance(network);
        const filter: any = bridge.filters[config.events.evm]?.();
        console.log("Filter: ", filter);

        const logs = await web3.getLogs(
          network,
          bridge,
          filter!,
          fromBlockNumber,
          toBlockNumber
        );
        console.log(`Logs retrieved for network ${network}: `, logs);

        for (const log of logs) {
          const parsedLog = bridge.interface.parseLog(log);
          console.log("Parsed Logs: ", parsedLog);
          await saveLockEvent(network, log, parsedLog, bridge);
          console.log(`Log saved for network ${network}: `, log);
        }

        // Update the last synced block number
        await redis.setLastSyncBlockNumber(
          network,
          config.events.evm,
          toBlockNumber
        );
        console.log(
          `Updated last synced block for network ${network} to block ${toBlockNumber}`
        );
      } catch (networkError: any) {
        console.error(
          `Error processing network ${network}: `,
          networkError.message
        );
        loggers.logger.error(
          `🚫 | Error processing network ${network}`,
          networkError.message
        );
      }
    });

    // Run all network tasks concurrently
    await Promise.all(networkTasks); // Or use `Promise.allSettled` if you want to avoid failures affecting other tasks

    console.log("All network tasks completed");
  } catch (e: any) {
    console.error("Error in blockscanner: ", e.message);
    loggers.logger.error(`🚫 | Error in EVM block Scanner`, e.message);
    // Optionally, restart the scanner
    evmBlockScanner();
  }
};

export default {
  worker: evmBlockScanner,
  cronTimer: config.cronInfo.evmBlockScanner,
};
