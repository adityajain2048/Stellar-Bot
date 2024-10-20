import { Token } from "../../types";

export const ethTokens: Token[] = [
  {
    name: "Polygon",
    symbol: "MATIC",
    address: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
    decimals: 18,
    logoURI:
      "https://gfa.nyc3.digitaloceanspaces.com/testapp/testdir/MATIC.png",
    coinGeckoId: "matic-network",
  },
  {
    name: "WETH",
    symbol: "WETH",
    address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    decimals: 18,
    logoURI: "https://gfa.nyc3.digitaloceanspaces.com/testapp/testdir/WETH.png",
    coinGeckoId: "weth",
  },
  //Stable Coins
  {
    name: "Tether USDT",
    symbol: "USDT",
    address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
    decimals: 6,
    logoURI: "https://gfa.nyc3.digitaloceanspaces.com/testapp/testdir/USDT.png",
    coinGeckoId: "tether",
  },
  {
    name: "USD Coin",
    symbol: "USDC",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    decimals: 6,
    logoURI: "https://gfa.nyc3.digitaloceanspaces.com/testapp/testdir/USDC.png",
    coinGeckoId: "usd-coin",
  },
  // Other Tokens
  {
    name: "Wrapped Bitcoin",
    symbol: "WBTC",
    address: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
    decimals: 8,
    logoURI: "https://gfa.nyc3.digitaloceanspaces.com/testapp/testdir/BTCB.png",
    coinGeckoId: "wrapped-bitcoin",
  },
  {
    name: "Aave",
    symbol: "AAVE",
    address: "0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9",
    decimals: 18,
    logoURI: "https://gfa.nyc3.digitaloceanspaces.com/testapp/testdir/aave.png",
    coinGeckoId: "aave",
  },
  {
    name: "Compound",
    symbol: "COMP",
    address: "0xc00e94cb662c3520282e6f5717214004a7f26888",
    decimals: 18,
    logoURI: "https://gfa.nyc3.digitaloceanspaces.com/testapp/testdir/comp.png",
    coinGeckoId: "compound-governance-token",
  },
  {
    name: "Splintershards",
    symbol: "SPS",
    address: "0x00813E3421E1367353BfE7615c7f7f133C89df74",
    decimals: 18,
    logoURI: "https://gfa.nyc3.digitaloceanspaces.com/testapp/testdir/SPS.png",
    coinGeckoId: "splinterlands",
  },
  {
    name: "TeraBlock",
    symbol: "TBC",
    address: "0xa1ed0364d53394209d61ae8bfdb8ff50484d8c91",
    decimals: 18,
    logoURI: "https://gfa.nyc3.digitaloceanspaces.com/testapp/testdir/TBC.png",
    coinGeckoId: "terablock",
  },
  {
    name: "Dark Energy Crystals",
    symbol: "DEC",
    address: "0x9393fdc77090f31c7db989390d43f454b1a6e7f3",
    decimals: 3,
    logoURI: "https://gfa.nyc3.digitaloceanspaces.com/testapp/testdir/DEC.png",
    coinGeckoId: "dark-energy-crystals",
  },
];
