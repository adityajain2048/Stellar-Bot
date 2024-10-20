import { Token } from "../../types";

export const hiveTokens: Token[] = [
  {
    name: "Genesis League Sports Governance Token",
    symbol: "GLX",
    address: "GLX",
    decimals: 3,
    coinGeckoId: "glsd-coin",
    logoURI: "https://gfa.nyc3.digitaloceanspaces.com/testapp/testdir/GLX.png",
  },
  {
    name: "Genesis League Sports Stablecoin",
    symbol: "GLUSD",
    address: "GLUSD",
    decimals: 3,
    logoURI:
      "https://gfa.nyc3.digitaloceanspaces.com/testapp/testdir/GLUSD.png",
    coinGeckoId: "glsd-coin",
  },
  {
    name: "Splintershards",
    symbol: "SPS",
    address: "SPS",
    decimals: 8,
    logoURI: "https://gfa.nyc3.digitaloceanspaces.com/testapp/testdir/SPS.png",
    coinGeckoId: "splinterlands",
  },
  {
    name: "Dark Energy Crystals",
    symbol: "DEC",
    address: "DEC",
    decimals: 3,
    logoURI: "https://gfa.nyc3.digitaloceanspaces.com/testapp/testdir/DEC.png",
    coinGeckoId: "dark-energy-crystals",
  },
];

export const hiveInfo = {
  name: "Hive",
  rpcUrl: `https://api.hive.blog`,
  explorerUrl: "https://hiveblocks.com/",
  bridgeAddress: `HIVE`,
  bridgeDeployBlock: 0,
  mainToken: {
    name: "Hive",
    symbol: "HIVE",
    address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    graphAddress: "0xa5b8d90abad22c4f7a4fa87f8fbc4ee2c113b1c8",
    decimals: 5,
    logoURI: "https://gfa.nyc3.digitaloceanspaces.com/testapp/testdir/HIVE.png",
    coinGeckoId: "hive",
  },
  supportedTokens: hiveTokens,
};
