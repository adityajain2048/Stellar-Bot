interface TokensBuySell {
  coinTypeA: string;
  coinTypeB: string;
}

interface PoolResult {
  poolresult: any | null;
}

interface KriyaRoute {
  route: any | null;
}

interface PositionMessageId {
  id: any | null;
}
export interface IUserContext {
  trackObject: {
    functionName: string;
    functionParams: string;
    lastParamIndex: number;
    totalParams: number;
  };
  keypairObject: any;
  walletAddress: string;
  privateKey: string;
  vaultAddress: string;
  poolresult: any;
  kriyaRoute: any;
  walletMessageId: number;
  positionMessageId: number;
  isMaticTransfer: boolean;
  homeRefreshCount: number;
  walletRefreshCount: number;
  isBuying: boolean;
  transferTokenName: string;
}

export interface ItrackObject {
  functionName: string;
  functionParams: any;
  lastParamIndex: number;
  totalParams: number;
}

export const EmptyTrackObject = {
  functionName: "",
  functionParams: null,
  lastParamIndex: -1,
  totalParams: -1
};
