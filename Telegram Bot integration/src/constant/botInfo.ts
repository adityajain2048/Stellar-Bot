import { config } from "../config";
export const botInfo = {
  linea: {
    nativeToken: "ETH",
    nativeTokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    botName: "SideLine bot",
    botUsername: config.BOT_USERNAME,
    RPC_URL: "https://go.getblock.io/ed5545a27c5a44bc9b7c62950526d0c8",
    explorerUrl: "https://lineascan.build",
    dexScreenerUrl: "https://dexscreener.com/linea",
    fromTokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    toTokenAddress: "0x1a51b19ce03dbe0cb44c1528e34a7edd7771e9af",
    tokenInfoUrl:"https://dexscreener.com/linea"
  },
  sui: {
    nativeToken: "SUI",
    nativeTokenAddress: "0x0",
    botName: "suiSIDE",
    botUsername: "porfosuisidebot",
    RPC_URL: "",
    explorerUrl: "",
    fromTokenAddress: "",
    toTokenAddress: "",
  },
};
