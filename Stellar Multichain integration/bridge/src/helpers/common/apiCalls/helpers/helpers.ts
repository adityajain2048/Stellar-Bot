import { config, types } from "../../index";

export const getBaseUrlForChainId = (
  chainId: types.supportedChains
): string => {
  return `${config.evmChainsInfo[chainId as types.EvmChains]!.zeroxUrl}`;
};

export const getUrlWithQueryParams = (
  chainId: types.supportedChains,
  endpoint: string,
  params: Record<string, any>
): string => {
  const baseUrl = getBaseUrlForChainId(chainId);
  delete params.chainId;
  return `${baseUrl}${endpoint}?${getQueryParams(params)}`;
};

export const getQueryParams = (params: Record<string, string>): string => {
  let paramString = "";
  Object.entries(params).map(([key, value]) => {
    if (value) {
      paramString += `&${key}=${value}`;
    }
  });
  return paramString.slice(1);
};
