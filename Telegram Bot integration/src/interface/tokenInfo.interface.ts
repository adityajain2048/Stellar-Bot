export interface ITokenInfo {
  decimal: number;
  name: string;
  symbol: string;
  address: string;
  logoURI: string;
  coinGeckoId: string;
  isRecommended: boolean;
}

export interface IPositionToken {
  symbol: string;
  nativePrice: number;
  availableAmount: number;
  avgPrice: number;
  currentPrice: number;
  logoURI: string;
  initialAmountInUSD: number;
  currentAmountInUSD: number;
  currentAmountInNative: number;
  pnlInUSD:number;
  pnlInUSD2Place: number;
  pnlPercentage: number;
  pnlInNative: number;
}