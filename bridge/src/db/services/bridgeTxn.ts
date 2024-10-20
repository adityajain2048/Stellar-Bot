import { types, utils } from "../../helpers/common";
import { BridgeTxn } from "../models/bridgeTxnsModel";

export const createBridgeTxn = async (
  bridgeTxn: types.IBridgeTxn
): Promise<void> => {
  await BridgeTxn.create(bridgeTxn);
};

export const getPendingBridgeTxns = async (
  toNetwork: types.supportedChains,
  tokenSymbol: string
) => {
  const docs = await BridgeTxn.find({
    toNetwork,
    processed: false,
    remarks: { $exists: false },
    toToken: tokenSymbol,
    retries: { $lt: 5 },
  });
  return docs;
};

export const getPendingBridgeTxnsWithoutToken = async (
  toNetwork: types.supportedChains
) => {
  const docs = await BridgeTxn.find({
    toNetwork,
    processed: false,
    remarks: { $exists: false },
    retries: { $lt: 5 },
  });
  return docs;
};

export const markProcessed = async (
  lockId: string,
  params?: {
    releaseHash?: string;
    gasAmount?: string;
    releaseFee?: string;
    commissionAmount?: string;
    releaseAmount?: string;
    remarks?: string;
    crossPower?: string;
  }
): Promise<void> => {
  const $set: Record<string, any> = { processed: true };
  if (params?.releaseHash) $set.releaseHash = params.releaseHash;
  if (params?.gasAmount) $set.gasAmount = params.gasAmount;
  if (params?.releaseFee) $set.releaseFee = params.releaseFee;
  if (params?.crossPower) $set.crossPower = params.crossPower;
  if (params?.commissionAmount) $set.commissionAmount = params.commissionAmount;
  if (params?.releaseAmount) $set.releaseAmount = params.releaseAmount;
  if (params?.remarks) $set.remarks = params.remarks;
  const updatedTxn: any = await BridgeTxn.findOneAndUpdate(
    { lockId },
    { $set },
    { new: true }
  );
  return updatedTxn;
};

export const markRemarks = async (
  lockId: string,
  remarks: string
): Promise<void> => {
  await BridgeTxn.updateOne({ lockId }, { $set: { remarks } });
};

export const bridgeTxnExists = async (lockId: string): Promise<boolean> => {
  const doc = await BridgeTxn.findOne({ lockId });
  return !!doc;
};

export const incrementRetries = async (lockId: string): Promise<void> => {
  await BridgeTxn.updateOne({ lockId }, { $inc: { retries: 1 } });
};

export const getInfoByLockHash = async (lockHash: string) => {
  const doc = await BridgeTxn.findOne({ lockHash });
  return doc;
};

export const getTransactionByLockId = async (lockId: string) => {
  const doc = await BridgeTxn.findOne({ lockId }).lean();
  return doc;
};
