import { Token } from "../../types";

export const polygonTokens: Token[] = [
  //Native Tokens
  {
    name: "BNB",
    symbol: "BNB",
    address: "0xa649325aa7c5093d12d6f98eb4378deae68ce23f",
    decimals: 18,
    logoURI: "https://gfa.nyc3.digitaloceanspaces.com/testapp/testdir/BNB.png",
    coinGeckoId: "binancecoin",
  },
  {
    name: "WETH",
    symbol: "WETH",
    address: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
    decimals: 18,
    logoURI: "https://gfa.nyc3.digitaloceanspaces.com/testapp/testdir/WETH.png",
    coinGeckoId: "weth",
  },
  //Stable Coins
  {
    name: "Tether USDT",
    symbol: "USDT",
    address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    decimals: 6,
    logoURI: "https://gfa.nyc3.digitaloceanspaces.com/testapp/testdir/USDT.png",
    coinGeckoId: "tether",
  },
  {
    name: "USD Coin",
    symbol: "USDC",
    address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    decimals: 6,
    logoURI: "https://gfa.nyc3.digitaloceanspaces.com/testapp/testdir/USDC.png",
    coinGeckoId: "usd-coin",
  },
  {
    name: "BUSD Binance Pegged",
    symbol: "BUSD",
    address: "0x9fb83c0635de2e815fd1c21b3a292277540c2e8d",
    decimals: 18,
    logoURI: "https://gfa.nyc3.digitaloceanspaces.com/testapp/testdir/BUSD.png",
    coinGeckoId: "binance-usd",
  },
  {
    name: "TrueUSD",
    symbol: "TUSD",
    address: "0x2e1ad108ff1d8c782fcbbb89aad783ac49586756",
    decimals: 18,
    logoURI: "https://gfa.nyc3.digitaloceanspaces.com/testapp/testdir/tusd.png",
    coinGeckoId: "true-usd",
  },
  //Other Tokens
  {
    name: "Wrapped Bitcoin",
    symbol: "WBTC",
    address: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
    decimals: 8,
    logoURI: "https://gfa.nyc3.digitaloceanspaces.com/testapp/testdir/BTCB.png",
    coinGeckoId: "wrapped-bitcoin",
  },
  {
    name: "DAI Stable Coin",
    symbol: "DAI",
    address: "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063",
    decimals: 18,
    logoURI: "https://gfa.nyc3.digitaloceanspaces.com/testapp/testdir/DAI.png",
    coinGeckoId: "dai",
  },
];
