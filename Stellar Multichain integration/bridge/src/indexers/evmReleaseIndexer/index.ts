import { config, loggers, web3, types } from "../../helpers/common";
import * as redis from "../../redis";
import { saveLockEvent, saveReleaseEvent } from "../../helpers";

const evmReleaseBlockScanner = async () => {
  try {
    const networkTasks = config.evmChains.map(async (network) => {
      try {
        // Get release logs for each network
        console.log("Getting Release logs for evmBlockScanner: ", network);

        const fromBlockNumber = await redis.getLastSyncBlockNumber(
          network,
          config.events.evmRelease
        );
        console.log("From Block: ", fromBlockNumber);

        const toBlockNumber = await web3.getLatestBlockNumber(network);
        console.log("To Block: ", toBlockNumber);

        if (fromBlockNumber == toBlockNumber) {
          console.log(`No new blocks for network: ${network}`);
          return; // No new blocks, skip to the next network
        }

        const bridge = await web3.getBridgeInstance(network);
        const filter: any = bridge.filters[config.events.evmRelease]?.();
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
          const provider = bridge.provider;

          await saveReleaseEvent(network, log, parsedLog, provider);
          console.log(`Log saved for network ${network}: `, log);
        }

        // Update the last synced block number after processing logs
        await redis.setLastSyncBlockNumber(
          network,
          config.events.evmRelease,
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
    await Promise.all(networkTasks); // Or `Promise.allSettled` if you'd like each task to complete regardless of errors

    console.log("All network release tasks completed");
  } catch (e: any) {
    console.error("Error in evm release blockscanner: ", e.message);
    loggers.logger.error(`🚫 | Error in EVM Release block Scanner`, e.message);
    // Optionally restart the scanner in case of failure
    evmReleaseBlockScanner();
  }
};

export default {
  worker: evmReleaseBlockScanner,
  cronTimer: config.cronInfo.evmReleaseBlockScanner,
};
