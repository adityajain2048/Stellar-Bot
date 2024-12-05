import "dotenv/config";
import z from "zod";
import { parseEnv, port } from "znv";
import { API_CONSTANTS } from "grammy";

const createConfigFromEnvironment = (environment: NodeJS.ProcessEnv) => {
  const config = parseEnv(environment, {
    NODE_ENV: z.enum(["development", "production"]),
    LOG_LEVEL: z
      .enum(["trace", "debug", "info", "warn", "error", "fatal", "silent"])
      .default("info"),

    // Bot
    BOT_MODE: {
      schema: z.enum(["polling", "webhook"]),
      defaults: {
        production: "webhook" as const,
        development: "polling" as const,
      },
    },
    BOT_SECRET: z.string(),
    BOT_ALLOWED_UPDATES: z
      .array(z.enum(API_CONSTANTS.ALL_UPDATE_TYPES))
      .default(["message", "callback_query"]),
    BOT_ADMINS: z.array(z.number()).default([]),
    BOT_TOKEN: z.string(),
    BOT_SERVER_HOST: z.string().default(""),

    // HTTP Server
    HTTP_SERVER_HOST: z.string().default("0.0.0.0"),
    HTTP_SERVER_PORT: port().default(80),

    //DB
    REDIS_URL: z.string(),
    MONGO_URL: z.string(),

    // Bot Username
    BOT_USERNAME: z.string(),
    // Biconomy
    SECRET_KEY: z.string(),
    BUNDLER_URL: z.string(),
    PAYMASTER_API_KEY: z.string(),


  });

  if (config.BOT_MODE === "webhook") {
    // validate webhook url in webhook mode
    z.string()
      .url()
      .parse(config.BOT_SERVER_HOST, {
        path: ["BOT_SERVER_HOST"],
      });
  }

  return {
    ...config,
    isDev: process.env.NODE_ENV === "development",
    isProd: process.env.NODE_ENV === "production",
    webhookURL: config.BOT_SERVER_HOST + config.BOT_TOKEN,
  };
};

export type Config = ReturnType<typeof createConfigFromEnvironment>;

export const config = createConfigFromEnvironment(process.env);
