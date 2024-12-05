import { types, utils } from "../helpers/common";
import axios from "axios";

export const SWAP_API_URL = utils.getEnvVar(`SWAP_API_URL`).replace(/\/$/, "");

export const get0xSwapData = async (
  params: types.SwapParams
): Promise<types.SwapResp> => {
  const url = SWAP_API_URL + `/api/v1/bridge/swap`;
  console.log("Params::::::", params);
  const res = await axios.post(url, { ...params });
  await utils.sleep(1); // force 1s wait to avoid RL
  return res.data.calldata;
};

/**
 * only works for USDT token
 */
export const getSynapseBridgeData = async (
  params: types.BridgeParams
): Promise<types.BridgeResp> => {
  const url = SWAP_API_URL + `/bridge`;
  const res = await axios.get<{ message: types.BridgeResp }>(url, { params });
  await utils.sleep(1); // force 1s wait to avoid RL
  return res.data.message;
};
