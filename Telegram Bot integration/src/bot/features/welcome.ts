import { Composer } from "grammy";
import { CustomContext } from "../context/CustomContext";
import { logHandle } from "../helpers/logger";
import { createWallets, generatePrivateKey } from "../web3/wallet";
import { handleStartCommand } from "../../helper/handleStartCommond";
import { closeButton, signInButton } from "../buttons/telegramMsgButton";
import { helpMessage } from "../messages/welcomeMessage";
import { showWallet } from "../../chains/linea/showWallet";

const composer = new Composer<CustomContext>();

const feature = composer.chatType("private");

feature.command("start", logHandle("command-start"), async (ctx) => {
     const walletAddress = ctx.session.smartAccountAddress;
  if (!walletAddress) {
        const privateKey = generatePrivateKey(ctx.from.id.toString());
    const wallet = await createWallets(privateKey);
    if (!wallet) {
      return ctx.reply("Failed to create wallet");
    }
    ctx.session.privateKey = privateKey;
    ctx.session.smartAccountAddress = wallet.smartAccountAddress;
    ctx.session.vaultAddress = wallet.vaultAddress;
  }
  // // securing wallet
  // ctx.api.sendMessage(ctx.chat.id, "Do you want secure wallet ", {
  //   reply_markup: {
  //     inline_keyboard: signInButton,
  //   },
  // });

  await handleStartCommand(ctx, ctx.chat.id);

});

// home commond
feature.command("home", logHandle("command-start"), async (ctx) => {
  await handleStartCommand(ctx, ctx.chat.id);
});
//help command
feature.command("help", logHandle("command-start"), async (ctx) => {
  await ctx.reply(helpMessage,{
    reply_markup: {
      inline_keyboard: closeButton,
    },
    parse_mode: "HTML",
  
  })
});
//wallet command
feature.command("wallet", logHandle("command-start"), async (ctx) => {
  await showWallet(ctx);
});

export { composer as welcomeFeature };
