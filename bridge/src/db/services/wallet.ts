import { types, utils } from "../../helpers/common";
import { Wallet } from "../models/walletModel";

export const createWallet = async (wallet: types.IWallet): Promise<void> => {
  await Wallet.create(wallet);
};

export const updateWalletCrosspower = async (
  crosspower: number,
  walletAddress: string
) => {
  await Wallet.findOneAndUpdate(
    {
      address: walletAddress.toLowerCase(),
    },
    {
      $inc: { crossPower: crosspower },
    }
  );
};
