import Mongoose, { InferSchemaType, Schema, Types, model } from "mongoose";
import { config } from "../../helpers/common";

const bridgeTxnSchema = new Schema(
  {
    lockId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    fromNetwork: {
      type: String,
      enum: config.supportedChains,
      required: true,
    },
    toNetwork: {
      type: String,
      enum: config.supportedChains,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
    recipient: {
      type: String,
      required: true,
    },
    username: String,
    fromToken: {
      type: String,
      required: true,
    },
    srcToken: {
      type: String,
      required: true,
    },
    toToken: {
      type: String,
      required: true,
    },
    lockHash: {
      type: String,
      required: true,
    },
    processed: {
      type: Boolean,
      default: false,
    },
    blockNumber: {
      type: String,
      required: true,
    },
    transactionIndex: {
      type: Number,
      required: true,
    },
    logIndex: {
      type: Number,
    },
    timestamp: {
      type: Number,
      required: true,
    },
    remarks: {
      type: String,
    },
    retries: {
      type: Number,
      default: 0,
    },
    txNumber: {
      type: Number,
    },
    releaseTime: {
      type: Number,
    },
    gasAmount: {
      type: String,
    },
    lockAmount: {
      type: String,
      required: true,
    },
    lockFee: {
      type: String,
      required: true,
    },
    releaseFee: {
      type: String,
    },
    crossPower: {
      type: String,
    },
    srcAmount: {
      type: String,
      required: true,
    },
    releaseAmount: {
      type: String,
    },
    commissionAmount: {
      type: String,
    },
    releaseHash: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

bridgeTxnSchema.pre("save", function (next) {
  const doc = this;
  if (doc.isNew) {
    BridgeTxn.countDocuments().then((count) => {
      doc.txNumber = count + 1;
      next();
    });
  } else {
    next();
  }
});
// export const BridgeTxn = Mongoose.models.BridgeTxn || model('BridgeTxn', bridgeTxnSchema);

// export const BridgeTxn = Mongoose.models.BridgeTxns || model<IBridgeTxn>("BridgeTxn", bridgeTxnSchema);
export const BridgeTxn = Mongoose.model("BridgeTransaction", bridgeTxnSchema);

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type bridgeTxn = PartialBy<
  InferSchemaType<typeof bridgeTxnSchema>,
  "createdAt"
>;
export type IBridgeTxn = PartialBy<bridgeTxn, "updatedAt">;
