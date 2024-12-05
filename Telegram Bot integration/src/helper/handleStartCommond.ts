import { getHomeButtons } from "../utils/getHomeButtons";
import { getWelcomeMsgOrPosition } from "../utils/getWelcomeMsgOrPosition";
import { getUserModel } from "../models/userSchema";
import { CHAIN_NAME } from "../config/config";
// import { homeButtons } from "../bot/buttons/telegramMsgButton";
import { botInfo } from "../constant/botInfo";
import { bot } from "..";
import { resetUserContext } from "../utils/resetUserContext";
import { refreshAssest } from "../services/refreshAssest";
import { generatePrivateKey,createWallets } from "../bot/web3/wallet";

export const handleStartCommand = async (ctx: any, chatId: number) => {
  try {
    // ctx.api.sendMessage(chatId, helpMsg);
    console.log("inside handleStartCommand....");
    const walletAddress = ctx.session.smartAccountAddress;
    const userModel = getUserModel(CHAIN_NAME);
    const userInfo = await userModel.findOne({
      walletAddress: walletAddress,
    });
    console.log("Found user info", userInfo);
    if (!userInfo) {
      // extracting referral chatId with substring method
      const referralChatId = ctx.message.text.substring(7);
      if(referralChatId){
        const privateKey = generatePrivateKey(referralChatId.toString());
        const wallet = await createWallets(privateKey);
        const referredWalletAddress = wallet.smartAccountAddress;
        await userModel.create({
          walletAddress: walletAddress,
          assets: [],
          referredBy: referredWalletAddress,
          chatId: chatId,
          isSecured: false,
        });
        // now updating referredBy user's referralCount
        const referredByUser = await userModel.findOne({
          walletAddress: referredWalletAddress,
        });
        if(referredByUser){
          referredByUser.referralCount += 1;
          await referredByUser.save();
        }
      }else{
        await userModel.create({
          walletAddress: walletAddress,
          assets: [],
          referredBy: "own",
          chatId: chatId,
          isSecured: false,
        });
      }
    }
    ctx.session.assets = userInfo.assets;
    const { msgForUser, urlReviewDisabled, isPnlAvailable } =
      await getWelcomeMsgOrPosition(ctx, chatId);
    let messageId = null;
    const homeButtons = getHomeButtons(
      botInfo[CHAIN_NAME as keyof typeof botInfo].fromTokenAddress,
      botInfo[CHAIN_NAME as keyof typeof botInfo].toTokenAddress,
      walletAddress
    );
    messageId = await ctx.api.sendMessage(chatId, msgForUser, {
      reply_markup: {
        inline_keyboard: homeButtons,
      },
      parse_mode: "HTML",
      disable_web_page_preview: true,
    });
   
    refreshAssest(walletAddress, ctx);
    // resetting usercontext
    await resetUserContext(ctx);
  } catch (error) {
    console.log("inside handleStartCommand catch...", error);
  }
};
