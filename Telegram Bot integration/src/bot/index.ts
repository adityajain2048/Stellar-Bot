import { Bot, session } from "grammy";
import { ignoreOld, sequentialize } from "grammy-middlewares";

//Session Storage
import { RedisAdapter } from "@grammyjs/storage-redis";

import { createContextConstructor } from "./context/CustomContext";

// import { hydrateReply, parseMode } from "@grammyjs/parse-mode";
import { autoRetry } from "@grammyjs/auto-retry";
import { config } from "../config";
import { logger } from "../logger";
import { errorHandler } from "./handlers/error";
import { updateLogger } from "./middlewares/updateLogger";
import { unhandledFeature } from "./features/unhandled";
import { welcomeFeature } from "./features/welcome";
import { initial } from "./middlewares/session";
import { redisInstance } from "../config/redis";

export const createBot = () => {
  const bot = new Bot(config.BOT_TOKEN, {
    ContextConstructor: createContextConstructor({ logger }),
    client: {
      canUseWebhookReply: (method) => method === "sendMessage",
    },
  });
  const storage = new RedisAdapter({ instance: redisInstance });
  //middleWares
  // bot.api.config.use(parseMode("HTML"));
  // bot.api.config.use(autoRetry());

  //handle errors in Bot
  const protectedBot = bot.errorBoundary(errorHandler);

  if (config.isDev) {
    protectedBot.use(updateLogger());
  }
  protectedBot
    .use(
      session({
        initial,
        storage,
        getSessionKey(ctx) {
          return `${ctx.me.username}:${ctx.chat?.id}`;
        },
      })
    )
    // .use(ignoreOld())
    .use(sequentialize());

  protectedBot.use(welcomeFeature);
  // must be the last handler
  protectedBot.use(unhandledFeature);
  return bot;
};
export type IBot = ReturnType<typeof createBot>;
