import { types, utils } from "../../helpers/common";
import { CrosspowerHistory } from "../models/crosspowerHistory";

export const createCrosspowerHistory = async (
  crosspowerHistory: types.ICrosspowerHistory
): Promise<void> => {
  await CrosspowerHistory.create(crosspowerHistory);
};
