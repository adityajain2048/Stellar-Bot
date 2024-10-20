import mongoose from "mongoose";

const crosspowerHistorySchema = new mongoose.Schema(
  {
    walletAddress: {
      type: String,
      required: [true, "walletAddress is required."],
    },
    type: {
      type: String,
      required: [true, "crosspower history type is required."],
    },
    description: {
      type: String,
      required: [true, "Description is required."],
    },
    crosspower: {
      type: Number,
      required: [true, "crosspower is required."],
    },
  },
  {
    timestamps: true,
  }
);

export const CrosspowerHistory = mongoose.model(
  "crosspowerHistory",
  crosspowerHistorySchema
);

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type crosspowerHistory = PartialBy<
  mongoose.InferSchemaType<typeof crosspowerHistorySchema>,
  "createdAt"
>;
export type ICrosspowerHistory = PartialBy<crosspowerHistory, "updatedAt">;
