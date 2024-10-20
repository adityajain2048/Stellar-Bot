import * as StellarSdk from "@stellar/stellar-sdk";
import { config } from "../../helpers/common";
import fs from "fs";
import constraints from "../../constraints";
import * as stellarUtils from "../../helpers/stellarHelpers";
import * as redis from "../../redis";

const stellerIndexer = async () => {
  try {
    console.log("Stellar Indexer Started for contract: ");

    const server = new StellarSdk.SorobanRpc.Server(
      constraints.stellarConstraints.sorobanServer
    );
    const latestLedger = await server.getLatestLedger();
    const latestLedgerSequence = latestLedger.sequence;
    const redisLastValue = await redis.getLastSyncBlockNumber(
      "stellar",
      "Lock"
    );
    const lastSyncLedger = redisLastValue;
    let currentLedger = lastSyncLedger
      ? lastSyncLedger
      : config.nonEvmChainsInfo["stellar"]!.bridgeDeployLedger;
    console.log("currentLedger before getting: ", currentLedger);
    const parsedEvents: any = [];
    while (currentLedger <= latestLedger.sequence) {
      const fetchedEvents: any = await server.getEvents({
        filters: [
          {
            type: "contract",
            contractIds: [config.nonEvmChainsInfo["stellar"]!.bridgeAddress],
          },
        ],
        startLedger: currentLedger,
        limit: 1000,
      });

      if (fetchedEvents.events.length > 0) {
        for (let fetchedEvent of fetchedEvents.events) {
          if (fetchedEvent.topic[1]) {
            const parsedEvent = stellarUtils.parseStellarEvent(fetchedEvent);
            console.log("parsedEvent:", parsedEvent);
            if (parsedEvent) {
              parsedEvents.push(parsedEvent);
            }
          }
          // await stellarUtils.claim();
        }
      }
      if (fetchedEvents.events.length < 1000) {
        break;
      }

      currentLedger += 1000;
    }

    await stellarUtils.saveStellarEvents(parsedEvents, server);
    await redis.setLastSyncBlockNumber("stellar", "Lock", latestLedgerSequence);
    console.log("stellar indexer ended");
  } catch (err: any) {
    console.log("Error in Stellar indexer: ", err.message);
    stellerIndexer();
  }
};

export default {
  worker: stellerIndexer,
  cronTimer: config.cronInfo.stellarScanner,
};
