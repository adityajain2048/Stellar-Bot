import coinPrices from "./prices";
import { schedule } from "../utils";
import { connect } from "../../../redis";
import { loggers } from "..";

export const startWorkers = async () => {
  try {
    //Cron Jobs
    const workers = [coinPrices];
    for (const worker of workers) {
      schedule(worker.cronTimer, worker.worker);
    }
  } catch (err) {
    loggers.logger.error("Error in Prices Workers", err);
  }
};
