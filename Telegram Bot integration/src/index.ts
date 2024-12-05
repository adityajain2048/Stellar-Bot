import { onShutdown } from "node-graceful-shutdown";
import { createBot } from "./bot";
import { logger } from "./logger";
import { config } from "./config";
import { createServer } from "./server";
import db from "./services/connectDatabase";
import { routes as indexRoutes } from "./routes/index";
import { updateTokenPriceWorker } from "./workers/updateTokenPrice.worker";
import { updateTokenPrice } from "./services/updateTokenPrice";
import { getSwapQuoteByKyber } from "./chains/linea/getSwapQuoteByKyber";

export const bot = createBot();
const startBotServer = async () => {
  try {
    // database connection
    db.on("connected", () => {
      console.log("Mongoose connected to MongoDB Atlas");
    });
    // telegram bot connection
    // const bot = createBot();
    const server = await createServer(bot);
    server.use(indexRoutes);
    server.listen(config.HTTP_SERVER_PORT, () => {
      logger.info({
        msg: "Server is listening...",
        host: config.HTTP_SERVER_HOST,
        port: config.HTTP_SERVER_PORT,
      });
    });

    // Graceful shutdown
    onShutdown(async () => {
      logger.info("shutdown");

      // await server.close()
      await bot.stop();
    });

    if (config.BOT_MODE === "webhook") {
      console.log("webhook mode...");
      // to prevent receiving updates before the bot is ready
      await bot.init();

      await bot.api.setWebhook(config.webhookURL, {
        allowed_updates: config.BOT_ALLOWED_UPDATES,
        // secret_token: config.BOT_SECRET,
      });
    } else if (config.BOT_MODE === "polling") {
      console.log("polling mode...");
      await bot.start({
        allowed_updates: config.BOT_ALLOWED_UPDATES,
        onStart: ({ username }) => {
          logger.info({
            msg: "bot running...",
            username,
          });
        },
      });
      console.log("bot running...");
    }
  } catch (error) {
    logger.error(error);
    console.log("inside index.ts inside catch...");
    process.exit(1);
  }
};

startBotServer();

if (!config.BOT_USERNAME.includes('test')) {
  updateTokenPriceWorker();
} else {
  console.log('Ignoring worker because it\'s a test');
}
