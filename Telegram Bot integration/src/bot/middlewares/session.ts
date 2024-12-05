import {
  EmptyTrackObject,
  ItrackObject,
} from "../../interface/userContext.interface";
export type SessionData = {
  privateKey: string | null;
  smartAccountAddress: string | null;
  vaultAddress: string | null;
  trackObject: ItrackObject | null;
  poolresult: any;
  kriyaRoute: any;
  walletMessageId: number | null;
  positionMessageId: number | null;
  isMaticTransfer: boolean;
  homeRefreshCount: number;
  walletRefreshCount: number;
  isBuying: boolean;
  tranferTokenName: string;
  mpin: string | null;
  selectedTokenAddress: string | null;
  selectedTokenInfo: any;
  lastMessageId: number | null;
  assets: any;
  nativeTokenBalance: number;
};

export const initial = (): SessionData => {
  return {
    privateKey: null,
    smartAccountAddress: null,
    vaultAddress: null,
    trackObject: EmptyTrackObject,
    poolresult: null,
    kriyaRoute: null,
    walletMessageId: 0,
    positionMessageId: 0,
    isMaticTransfer: false,
    homeRefreshCount: 1,
    walletRefreshCount: 1,
    isBuying: true,
    tranferTokenName: "",
    mpin: null,
    selectedTokenAddress: "",
    selectedTokenInfo: null,
    lastMessageId: null,
    assets: null,
    nativeTokenBalance: 0,
  };
};
