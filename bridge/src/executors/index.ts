import { utils } from "../helpers/common";
import evmExecutor from "./evm";
import stellarExecuter from "./nonEvm/stellarExecuter";

export const startExecutors = async () => {
  //Cron Jobs
  console.log("Executor started");
  const workers = [evmExecutor, stellarExecuter];
  // const workers = [evmExecutor, glsExecutor , tezosExecutor];

  for (const worker of workers) {
    utils.schedule(worker.cronTimer, worker.worker);
  }
};
