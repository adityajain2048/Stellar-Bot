import "dotenv/config";

export const envConfigs = {
  dbUrl: process.env.DB_URL!,
  stellarSecretSourceKey: process.env.STELLAR_SECRET_SOURCE_KEY!,
  redisUrl: process.env.REDIS_URL,
  stellarAccountSecret: process.env.STELLAR_ACCOUNT_SECRET!,
  validationCloudKey: process.env.VALIDATION_CLOUD_KEY!,
};
