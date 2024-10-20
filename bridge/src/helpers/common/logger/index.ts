import "dotenv/config";
import winston from "winston";

const logFormat = winston.format.combine(
  winston.format.align(),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(
    ({ level, message, timestamp }: Record<string, string>) =>
      `${level}: ${timestamp} ${message}`,
  ),
);

const createLogger = (filename: string) => {
  return winston.createLogger({
    transports: [
      new winston.transports.File({
        filename: `logs/${filename}`,
        maxsize: 5000000,
        maxFiles: 5,
      }),
    ],
    format: logFormat,
  });
};

export const logger = createLogger(`info.log`);
export const indexerLogger = createLogger(`indexer.log`);
export const executorLogger = createLogger(`executor.log`);

if (process.env.NODE_ENV !== "production") {
  logger.add(new winston.transports.Console());
  executorLogger.add(new winston.transports.Console());
  indexerLogger.add(new winston.transports.Console());
}

export * as functions from "./functions";
