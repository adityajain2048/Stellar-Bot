import { Token } from "../../types";

export const tezosTokens: Token[] = [
  {
    name: "Dogami",
    symbol: "DOGA",
    address: "KT1Ha4yFVeyzw6KRAdkzq6TxDHB97KG4pZe8",
    decimals: 5,
    logoURI:
      "https://assets.coingecko.com/coins/images/24510/large/doga_logo.png",
    coinGeckoId: "dogami",
  },
];

export const tezosInfo = {
  name: "Tezos",
  rpcUrl: `https://mainnet.ecadinfra.com`,
  explorerUrl: "https://tzkt.io/",
  bridgeAddress: `KT1ENtxQpJzr7MA3CqCNyEink6UT9Yd1f3jg`,
  bridgeDeployBlock: 0,
  mainToken: {
    name: "Tezos",
    symbol: "XTZ",
    address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    graphAddress: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
    decimals: 6,
    logoURI: "https://gfa.nyc3.digitaloceanspaces.com/testapp/testdir/XTZ.png",
    coinGeckoId: "tezos",
  },
  supportedTokens: tezosTokens,
};
