import connectDb from "./db/connectDb";
import { startExecutors } from "./executors";
import { startWorkers } from "./helpers/common/workers";
import { startIndexers } from "./indexers";
import stellerIndexer from "./indexers/nonEvmIndexer/stellerIndexer";
import { connect } from "./redis";

const main = async () => {
  await connectDb();
  await connect();
  startWorkers();
  startIndexers();
  startExecutors();
};
main().catch((err) => {
  console.log(err);
  // process.exit(1);
});
