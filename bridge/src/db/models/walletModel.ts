import mongoose from "mongoose";

const walletSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: [true, "Wallet address is required."],
    },
    chainType: {
      type: String,
      required: [true, "Must provide chainType"],
      enum: {
        values: ["EVM", "Non-EVM"],
        message: "Invalid chainType",
      },
    },
    isWhiteListed: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      // required: [true, "User id is required."]
    },
    balances: [
      {
        chainId: { type: String, required: true },
        tokens: [
          {
            token_address: { type: String },
            balance: { type: String },
          },
        ],
      },
    ],
    crossPower: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Wallet = mongoose.model("wallets", walletSchema);

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type wallet = PartialBy<
  mongoose.InferSchemaType<typeof walletSchema>,
  "createdAt"
>;
export type IWallet = PartialBy<wallet, "updatedAt">;
