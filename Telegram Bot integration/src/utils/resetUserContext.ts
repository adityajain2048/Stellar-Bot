import { EmptyTrackObject } from "../interface/userContext.interface";

export const resetUserContext = async (ctx: any) => {
  ctx.session.trackObject = EmptyTrackObject;
  ctx.session.poolresult = null;
  ctx.session.kriyaRoute = null;
  ctx.session.walletMessageId = 0;
  ctx.session.positionMessageId = 0;
  ctx.session.isMaticTransfer = false;
  ctx.session.homeRefreshCount = 1;
  ctx.session.walletRefreshCount = 1;
  ctx.session.isBuying = true;
  ctx.session.tranferTokenName = "";
  ctx.session.mpin = null;
  ctx.session.selectedTokenAddress = "";
  ctx.session.selectedTokenInfo = null;
};
