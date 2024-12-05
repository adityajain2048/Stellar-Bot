import { types } from "../../common";
import { getUrlWithQueryParams } from "./helpers/helpers";

export const getSwapData = async (
  params: types.validationTypes.SwapParams
): Promise<types.validationTypes.SwapResponse> => {
  const url = getUrlWithQueryParams(params.chainId, "swap/v1/quote", params);
  const requestHeaders: HeadersInit = new Headers();
  requestHeaders.set("Content-Type", "application/json");
  requestHeaders.set("0x-api-key", process.env["OX_API_KEY"] as string);
  const response = await fetch(url, {
    method: "GET",
    headers: requestHeaders,
  });
  const data = await response.json();
  if (data.code === 100) {
    throw new Error(data.validationErrors[0].reason);
  } else {
    return data as types.validationTypes.SwapResponse;
  }
};
