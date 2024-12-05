import { undefined } from "zod";

export const showWalletAddress = async (ctx: any) => {
  const walletAddress = ctx.session.smartAccountAddress;
  const chatId = ctx.chat.id;
  await ctx.api.sendMessage(
    chatId,
    `Your wallet address\n<code>${walletAddress}</code>\nTap to copy address`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "❌ Close",
              callback_data: "cancel",
            },
          ],
        ],
      },
      parse_mode: "HTML",
    }
  );
};
