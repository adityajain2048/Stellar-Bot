import { CHAIN_NAME } from "../../config/config";
import { getUserModel } from "../../models/userSchema";
import { getWelcomeMsgOrPosition } from "../../utils/getWelcomeMsgOrPosition";
import { resetUserContext } from "../../utils/resetUserContext";

export const handleRefreshHome = async (ctx: any, chatId: number) => {
  try {
    console.log("inside handle refreshh.............");
    const { msgForUser, urlReviewDisabled, isPnlAvailable } =
      await getWelcomeMsgOrPosition(ctx, chatId);

    // resetting usercontext
    // await resetUserContext(ctx);
    return msgForUser;
  } catch (error) {
    console.log("inside handleStartCommand catch...", error);
    return "error in refreshing home page...";
  }
};
