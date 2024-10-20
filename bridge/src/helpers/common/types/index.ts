import * as config from "../config/index";

export * as validationTypes from "./validation";
export * as loggerTypes from "./logger";

export type EvmChains = (typeof config.evmChains)[number];
export type supportedChains = (typeof config.supportedChains)[number];
export type AlchemyNetworks = (typeof config.alchemyNetworks)[number];
export type { IBridgeTxn } from "../../../db/models/bridgeTxnsModel";
export type { ICrosspowerHistory } from "../../../db/models/crosspowerHistory";
export type { IWallet } from "../../../db/models/walletModel";

export type EvmChainInfo = {
  chainId: number;
  name: string;
  zeroxUrl: string;
  rpcUrl: string;
  explorerUrl: string;
  bridgeAddress: string;
  bridgeDeployBlock: number;
  eventPollingInterval: number;
  hivePlayerId?: string;
  mainToken: Token;
  supportedTokens: Token[];
};

export type Token = {
  name: string;
  symbol: string;
  address: string;
  decimals: number;
  logoURI: string;
  coinGeckoId: string;
  bridge?: string;
  bridgeDeployBlock?: number;
  graphAddress?: string;
};

export type LockEvent = {
  fromNetwork: supportedChains;
  toNetwork: supportedChains;
  lockId: string;
  lockHash: string;
  logIndex: number;
};

export enum CacheKeys {
  LAST_SYNC_BLOCK_NUMBER = "LAST_SYNC_BLOCK_NUMBER",
  LAST_SYNC_HIVE_TXN_ID = "LAST_SYNC_HIVE_TXN_ID",
  LAST_SYNC_TEZOS_OP_ID = "LAST_SYNC_TEZOS_OP_ID",
  PRICES = "PRICES",
  TOKEN_INFO = "TOKEN_INFO",
}

export interface Log {
  blockNumber: number;
  blockHash: string;
  transactionIndex: number;
  removed: boolean;
  address: string;
  data: string;
  topics: string[];
  transactionHash: string;
  logIndex: number;
}

export interface SwapParams {
  sellToken: string;
  buyToken: string;
  sellAmount: string;
  chainId: string;
}

export interface BridgeParams {
  chainIdFrom: number;
  chainIdTo: number;
  amountFrom: string;
  addressTo: string;
}

export interface SwapResp {
  quote: string;
  calldata: string;
}

export interface BridgeResp {
  quote: string;
  rawTx: {
    data: string;
    to: string;
  };
}

export interface Price {
  usd: number;
}

export type CoingeckoPriceResponse = {
  [key: string]: Price;
};

export type PricesCache = Record<string, string>;

export type IndexerConfig = {
  listener?: () => void;
  backup: () => Promise<void>;
  cronTimer: string;
};

export type TokenInfo = {
  symbol: string;
  decimals: number;
};

export type Response<T = any> = {
  status: "success" | "error";
  message: T;
};

export type Stats = {
  uniqueUsers: number;
  totalVostellare: string;
  totalTokens: string;
  totalTransactions: number;
};
