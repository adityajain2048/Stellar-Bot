import "dotenv/config";
export const COMMISSION_PERCENT = 0.5;

export const events = {
  evm: "Lock",
  evmRelease: "Release",
};

export const remarks = {
  INVALID_USERNAME: `INVALID_USERNAME`,
  ALREADY_PROCESSED: `ALREADY_PROCESSED`,
  INSUFFICIENT_AMOUNT: `INSUFFICIENT_AMOUNT`,
  NO_GLS_RELEASE_HASH: `NO_GLS_RELEASE_HASH`,
};

export const INDEXERS = ["lock", "prices"] as const;

export const ALCHEMY_PROJECT_ID = process.env.ALCHEMY_PROJECT_ID || "";
export const INFURA_PROJECT_ID: string[] =
  process.env.INFURA_PROJECT_ID?.split(",") || [];
export let currentInfuraKey = INFURA_PROJECT_ID[0];
export const getRpcApi = () => {
  return currentInfuraKey;
};

export const setNextRpcApi = (): void => {
  const currentIndex = INFURA_PROJECT_ID.indexOf(currentInfuraKey!);
  if (currentIndex !== -1) {
    currentInfuraKey =
      INFURA_PROJECT_ID[(currentIndex + 1) % INFURA_PROJECT_ID.length];
  }
};

export const cronInfo = {
  prices: `*/5 * * * *`, // 5 mins
  evmBlockScanner: `*/15 * * * * *`, // 15s
  evmReleaseBlockScanner: `*/15 * * * * *`, // 15s
  stellarScanner: `*/15 * * * * *`, // 15s
  glsTxnScanner: `*/15 * * * * *`, // 15s
  tezosLockOpScanner: `*/45 * * * * *`, // 45s
  evmExecutor: `*/20 * * * * *`, // 20s
  nonEvmExecutor: `*/20 * * * * *`, // 20s
  glsExecutor: `*/15 * * * * *`, // 15s
  tezosExecutor: `*/45 * * * * *`, // 45s
  // rebalancer: `7 * * * *`,
  // indexerBackup: `*/1 * * * *`, // 1m
  // indexer: `*/45 * * * * *`,
};

export * from "./chains";
