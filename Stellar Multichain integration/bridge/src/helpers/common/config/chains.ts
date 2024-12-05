import { getRpcApi } from ".";
import { EvmChainInfo, EvmChains } from "../types";
import { bscTokens } from "./evmChains/bscTokens";
import { ethTokens } from "./evmChains/ethTokens";
import { polygonTokens } from "./evmChains/polygonTokens";
import { arbitrumTokens } from "./evmChains/arbitrumTokens";
import { stellarTokens } from "./nonEvmChains/stellarTokens";
import { baseTokens } from "./evmChains/baseTokens";

export const evmChains = ["poly", "bsc", "arb", "eth", "base"] as const;
// export const evmChains = ["eth"] as const;

export const bridgeTokenAddress = "0x779877A7B0D9E8603169DdbD7836e478b4624789";
export const evmChainsInfo: Record<string, EvmChainInfo> = {
  bsc: {
    chainId: 56,
    name: "Binance Smart Chain",
    zeroxUrl: "https://bsc.api.0x.org/",
    // rpcUrl: `https://site1.moralis-nodes.com/bsc/ec8dad635a2942ebbc7fa1ea29b2bc83`,
    rpcUrl: `https://bsc.meowrpc.com`,
    // rpcUrl: `https://bsc-rpc.publicnode.com`,
    explorerUrl: "https://bscscan.com/",
    bridgeAddress: `0xbE121263691552E8a981a13FBeaB4FAf84FA6cdD`,
    bridgeDeployBlock: 41986976,
    eventPollingInterval: 3000,
    hivePlayerId: "terablock-bsc",
    mainToken: {
      name: "Binance Coin",
      symbol: "BNB",
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      graphAddress: "0xB8c77482e45F1F44dE1745F52C74426C631bDD52",
      decimals: 18,
      logoURI:
        "https://gfa.nyc3.digitaloceanspaces.com/testapp/testdir/BNB.png",
      coinGeckoId: "binancecoin",
    },
    supportedTokens: bscTokens,
  },
  eth: {
    chainId: 1,
    name: "Ethereum",
    zeroxUrl: "https://api.0x.org/",
    rpcUrl: `https://rpc.lokibuilder.xyz/wallet	`,
    explorerUrl: "https://etherscan.io/",
    bridgeAddress: `0xbE121263691552E8a981a13FBeaB4FAf84FA6cdD`,
    bridgeDeployBlock: 18083803,
    eventPollingInterval: 10000,
    // hiveWallet: "terablock-eth",
    mainToken: {
      name: "Ether",
      symbol: "ETH",
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      graphAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      decimals: 18,
      logoURI:
        "https://gfa.nyc3.digitaloceanspaces.com/testapp/testdir/ETH.png",
      coinGeckoId: "ethereum",
    },
    supportedTokens: ethTokens,
  },

  poly: {
    chainId: 137,
    name: "Polygon",
    zeroxUrl: "https://polygon.api.0x.org/",
    // rpcUrl: `https://site2.moralis-nodes.com/polygon/33ee35df39e44e4c8df0f84372d79b93`,
    // rpcUrl: `https://polygon-mainnet.infura.io/v3/${getRpcApi()}`,
    rpcUrl: `https://polygon-mainnet.infura.io/v3/`,
    explorerUrl: "https://polygonscan.com/",
    bridgeAddress: `0x21568459854Adcda462F6D9C11ce4F157Dc70f93`,
    bridgeDeployBlock: 61454670,
    eventPollingInterval: 3000,
    mainToken: {
      name: "Matic",
      symbol: "MATIC",
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      graphAddress: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
      decimals: 18,
      logoURI:
        "https://gfa.nyc3.digitaloceanspaces.com/testapp/testdir/MATIC.png",
      coinGeckoId: "matic-network",
    },
    supportedTokens: polygonTokens,
  },
  arb: {
    chainId: 42161,
    name: "Arbitrum",
    zeroxUrl: "https://arbitrum.api.0x.org/",
    // rpcUrl: `https://site1.moralis-nodes.com/arbitrum/57d1ee4880a04a60bc7523e2a4a41ebf`,
    rpcUrl: `https://arbitrum-mainnet.infura.io/v3/`,
    explorerUrl: "https://arbiscan.io/",
    bridgeAddress: `0x21568459854Adcda462F6D9C11ce4F157Dc70f93`,
    bridgeDeployBlock: 250330619,
    eventPollingInterval: 3000,
    mainToken: {
      name: "Ether",
      symbol: "ETH",
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      graphAddress: "0x9623063377AD1B27544C965cCd7342f7EA7e88C7",
      decimals: 18,
      logoURI:
        "https://gfa.nyc3.digitaloceanspaces.com/testapp/testdir/ARB.png",
      coinGeckoId: "ethereum",
    },
    supportedTokens: arbitrumTokens,
  },
  base: {
    chainId: 42161,
    name: "Base",
    zeroxUrl: "https://base.api.0x.org/",
    // rpcUrl: `https://site1.moralis-nodes.com/arbitrum/57d1ee4880a04a60bc7523e2a4a41ebf`,
    rpcUrl: `https://mainnet.base.org`,
    explorerUrl: "https://basescan.org/",
    bridgeAddress: `0x19f3d4308e48a26f531d3235be9aa1393e4da194`,
    bridgeDeployBlock: 20897600,
    eventPollingInterval: 3000,
    mainToken: {
      name: "Ether",
      symbol: "ETH",
      address: "0x4200000000000000000000000000000000000006",
      graphAddress: "0x4200000000000000000000000000000000000006",
      decimals: 18,
      logoURI:
        "https://raw.githubusercontent.com/baseswapfi/default-token-list/main/images/ETH.webp",
      coinGeckoId: "ethereum",
    },
    supportedTokens: baseTokens,
  },
};

export const nonEvmChainsInfo: Record<string, any> = {
  stellar: {
    chainId: 1,
    name: "Stellar",
    bridgeAddress: "CAZB2F2GXXDTDZHY55K736BIEJVUYV6UYMKPZUW2VTSIJI3JL4NV42FC",
    bridgeDeployLedger: 53352792,
    mainToken: {
      name: "Stellar Lumens",
      address: "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
      graphAddress: "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
      symbol: "XLM",
      logoURI:
        "https://assets.coingecko.com/coins/images/100/standard/Stellar_symbol_black_RGB.png",
      decimals: 7,
      coinGeckoIds: "xlm",
    },

    supportedTokens: stellarTokens,
  },
};

export const supportedChains = [
  "poly",
  "arb",
  "bsc",
  "stellar",
  "eth",
  "base",
] as const;
// export const supportedChains = ["eth"] as const;

export const alchemyNetworks = ["arb", "poly", "eth"] as const;
// export const alchemyNetworks = [ "eth"] as const;

export const allChainsInfo = {
  ...evmChainsInfo,
  ...nonEvmChainsInfo,
};

const mainTokenCoinIds = Object.values(evmChainsInfo).map(
  (chain) => chain.mainToken.coinGeckoId
);
const tokenCoinIds = Object.values(evmChainsInfo)
  .map((chain) => chain.supportedTokens.map((token) => token.coinGeckoId))
  .flat();

export const coinGeckoIds = [
  ...mainTokenCoinIds,
  ...tokenCoinIds,
  "stellar",
].filter((value) => value) as string[];
