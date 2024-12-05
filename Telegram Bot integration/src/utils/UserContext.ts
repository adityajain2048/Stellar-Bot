// interface TrackObject {
//     functionName: string | null;
//     functionParams: {
//         amount: number;
//         receiverAddress: string;
//     };
//     lastParamIndex: number;
//     totalParams: number | null;
// }

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

export class UserContext {
  trackObject: any = {
    functionName: null,
    functionParams: null,
    lastParamIndex: 0,
    totalParams: null,
  };
  keypairObject: any | null = null;
  saAddress: string = "";
  privateKey: string = "";
  vaultAddress: string = "";
  currentMsgToParams: { [key: string]: any } = {};
  tokensBuySell: TokensBuySell = {
    coinTypeA: "",
    coinTypeB: "",
  };
  poolresult: PoolResult = { poolresult: null };
  kriyaRoute: KriyaRoute = { route: null };
  walletMessageId: any | null = null;
  positionMessageId: PositionMessageId = { id: null };
  constructor(public chatId: number) {
    return this;
  }
  isMaticTransfer: boolean = false;
  homeRefreshCount: number = 1;
  walletRefreshCount: number = 1;
  isBuying: boolean = true;
  transferTokenName = "";
}

export const EmptyUserContext = {
  trackObject: {
    functionName: "",
    functionParams: "",
    lastParamIndex: -1,
    totalParams: -1,
  },
  keypairObject: null,
  walletAddress: "",
  privateKey: "",
  vaultAddress: "",
  poolresult: null,
  kriyaRoute: null,
  walletMessageId: 0,
  positionMessageId: 0,
  isMaticTransfer: false,
  homeRefreshCount: 1,
  walletRefreshCount: 1,
  isBuying: true,
  transferTokenName: "",
};
