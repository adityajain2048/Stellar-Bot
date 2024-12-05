import fastify from "fastify";
import { webhookCallback } from "grammy";
import express from "express";
import { logger } from "../logger";
import { IBot } from "../bot";
import cors from "cors";
import { config } from "../config";
import { pinoHttp } from "pino-http";

export const createServer = async (bot: IBot) => {
  // const server = fastify({
  //   logger,
  // });

  // server.addHook('onSend', function(request, reply, payload, done) {
  //   reply.headers({'content-type': 'application/json'})
  //   done()
  // })

  // server.setErrorHandler(async (error, request, response) => {
  //   logger.error(error);

  //   await response.status(500).send({ error: "Oops! Something went wrong." });
  // });

  // server.get("/", () => ({ status: true }));

  // server.post(
  //   `/${bot.token}`,
  //   webhookCallback(bot, "fastify", {
  //     // timeoutMilliseconds: 1,
  //     // onTimeout: (args) => {
  //     //   console.log(args);
  //     // },
  //     // secretToken: config.BOT_SECRET,
  //   })
  // );

  // return server;

  const app = express();

  app.use(express.json());
  app.use(cors({ origin: "*" }));
  // app.use(pinoHttp({ logger }));
  app.post(
    `/${bot.token}`,
    webhookCallback(bot, "express", {
      // secretToken: config.BOT_SECRET,
    })
  );

  return app
};
