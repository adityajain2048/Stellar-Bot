import { Token } from "../../types";

export const bscTokens: Token[] = [
  // native Tokens
  {
    name: "WETH",
    symbol: "WETH",
    address: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
    decimals: 18,
    logoURI: "https://gfa.nyc3.digitaloceanspaces.com/testapp/testdir/WETH.png",
    coinGeckoId: "weth",
  },
  //Stable Coins
  {
    name: "Tether USDT",
    symbol: "USDT",
    address: "0x55d398326f99059fF775485246999027B3197955",
    decimals: 18,
    logoURI: "https://gfa.nyc3.digitaloceanspaces.com/testapp/testdir/USDT.png",
    coinGeckoId: "tether",
  },
  {
    name: "USD Coin",
    symbol: "USDC",
    address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
    decimals: 18,
    logoURI: "https://gfa.nyc3.digitaloceanspaces.com/testapp/testdir/USDC.png",
    coinGeckoId: "usd-coin",
  },
  {
    name: "BUSD Binance Pegged",
    symbol: "BUSD",
    address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
    decimals: 18,
    logoURI: "https://gfa.nyc3.digitaloceanspaces.com/testapp/testdir/BUSD.png",
    coinGeckoId: "binance-usd",
  },
  // Other Tokens
  {
    name: "Binance Pegged DAI",
    symbol: "DAI",
    address: "0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3",
    decimals: 18,
    logoURI: "https://gfa.nyc3.digitaloceanspaces.com/testapp/testdir/DAI.png",
    coinGeckoId: "dai",
  },
  {
    name: "Splintershards",
    symbol: "SPS",
    address: "0x1633b7157e7638C4d6593436111Bf125Ee74703F",
    decimals: 18,
    logoURI: "https://gfa.nyc3.digitaloceanspaces.com/testapp/testdir/SPS.png",
    coinGeckoId: "splinterlands",
  },
  {
    name: "TeraBlock",
    symbol: "TBC",
    address: "0x9798dF2f5d213a872c787bD03b2b91F54D0D04A1",
    decimals: 18,
    logoURI: "https://gfa.nyc3.digitaloceanspaces.com/testapp/testdir/TBC.png",
    coinGeckoId: "terablock",
  },
  {
    name: "Dark Energy Crystals",
    symbol: "DEC",
    address: "0xe9d7023f2132d55cbd4ee1f78273cb7a3e74f10a",
    decimals: 3,
    logoURI: "https://gfa.nyc3.digitaloceanspaces.com/testapp/testdir/DEC.png",
    coinGeckoId: "dark-energy-crystals",
  },
  {
    name: "Genesis League Sports Governance Token",
    symbol: "GLX",
    address: "0x1eDbF5Cd44Fa39585Ad03B1881c2f56fd67A83F9",
    decimals: 18,
    logoURI: "https://gfa.nyc3.digitaloceanspaces.com/testapp/testdir/GLX.png",
    bridge: "0x143a19743eea818d90b2AB496e56d65d4891fd3E",
    bridgeDeployBlock: 33595489,
    coinGeckoId: "glsd-coin",
  },
  {
    name: "Genesis League Sports Stablecoin",
    symbol: "GLUSD",
    address: "0x75A16dE6C79bF2F76142D673c1AfA392b6A61b51",
    decimals: 18,
    logoURI:
      "https://gfa.nyc3.digitaloceanspaces.com/testapp/testdir/GLUSD.png",
    coinGeckoId: "glsd-coin",
    bridge: "0x1bb2eDA3889F565682E9F095Fa7fB2456756443c",
    bridgeDeployBlock: 33595489,
  },
];
