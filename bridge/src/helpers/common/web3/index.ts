import abis, { bridges } from "../abis";
import * as alchemy from "alchemy-sdk";
import * as ethers from "ethers";
import * as types from "../types";
import * as config from "../config";
import { utils } from "..";
import * as redis from "../../../redis";
import { big } from "../utils";
export * from "ethers";
export * from "./fees";

export const parseUnits = (amount: string, decimal: number) => {
  const parsedAmount = ethers.utils.parseUnits(amount, decimal);
  return parsedAmount;
};
export const getFeeByHash = async (
  hash: string,
  bridge: any,
  network: string
) => {
  const provider = bridge.provider;
  const receipt = await provider.getTransactionReceipt(hash);
  const feeAmount = receipt.gasUsed;
  const feeAmountBig = big(feeAmount.toString());
  const transaction = await provider.getTransaction(hash);
  const feePrice = transaction.gasPrice;
  const feePriceBig = big(feePrice.toString());
  const totalFeeWei = feePriceBig.mul(feeAmountBig);
  const lockFee = totalFeeWei.div(
    big("10").pow(config.evmChainsInfo[network]!.mainToken.decimals)
  );
  const prices = await redis.getCoinPricesCache();
  const coinGeckoId = config.evmChainsInfo[network]!.mainToken.coinGeckoId;
  const lockFeeInUsd = utils.stringify(lockFee.mul(prices[coinGeckoId]));

  return utils.stringify(lockFeeInUsd);
};

export const getProvider = (network: types.EvmChains) => {
  const rpc = config.evmChainsInfo[network]!.rpcUrl;
  let provider;
  if (network != "bsc" && network != "eth" && network != "base") {
    provider = new ethers.providers.JsonRpcProvider(rpc + config.getRpcApi());
  } else {
    provider = new ethers.providers.JsonRpcProvider(rpc);
  }
  return provider;
};

export const getWallet = (network: types.EvmChains): ethers.Wallet => {
  const pk = utils.getEnvVar(`EXECUTOR_PRIVATE_KEY`);
  const provider = getProvider(network);
  const wallet = new ethers.Wallet(pk, provider);
  return wallet;
};

export const getBridgeTokenAndAddress = (
  network: types.EvmChains,
  tokenSymbol?: string
) => {
  let bridgeAddress: string | undefined;
  let bridgeToken: string | undefined;
  if (tokenSymbol) {
    const token = config.evmChainsInfo[network]!.supportedTokens.find(
      (token) => token.symbol === tokenSymbol.toLowerCase()
    );
    bridgeAddress = token?.address;
    bridgeToken = token?.symbol;
  }
  if (!bridgeAddress || !bridgeToken) {
    bridgeAddress = config.evmChainsInfo[network]!.bridgeAddress;
    bridgeToken = config.evmChainsInfo[network]!.mainToken.symbol;
  }
  return { bridgeAddress, bridgeToken };
};

export const getBridgeAbi = (bridge: bridges) => {
  const abi = abis.bridge[bridge];
  return abi as ethers.ContractInterface;
};

export const getBridgeInstance = async (
  network: types.EvmChains,
  tokenSymbol?: string
) => {
  // const address = config.evmChainsInfo[network]!.bridgeAddress;
  let wallet = getWallet(network);
  const { bridgeAddress, bridgeToken } = getBridgeTokenAndAddress(
    network,
    tokenSymbol
  );
  const bridgeAbi = getBridgeAbi(bridgeToken.toLowerCase() as bridges);
  let bridge = new ethers.Contract(bridgeAddress, bridgeAbi, wallet);
  // try {
  //   const filter: any = bridge.filters[config.events.evm]?.();
  //   console.log("Filter: ", filter);
  //   console.log(
  //     "fromBlock: ",
  //     config.evmChainsInfo[network]!.bridgeDeployBlock
  //   );
  //   console.log("toBlock: ", config.evmChainsInfo[network]!.bridgeDeployBlock);
  //   // await bridge.provider.getLogs({
  //   //   ...filter,
  //   //   fromBlock: config.evmChainsInfo[network]!.bridgeDeployBlock,
  //   //   toBlock: config.evmChainsInfo[network]!.bridgeDeployBlock,
  //   // });
  //   console.log(
  //     "log for test",
  //     await bridge.provider.getLogs({
  //       ...filter,
  //       fromBlock: config.evmChainsInfo[network]!.bridgeDeployBlock,
  //       toBlock: config.evmChainsInfo[network]!.bridgeDeployBlock,
  //     })
  //   );
  // } catch (err: any) {
  //   console.log("Error while getting logs: ", err.message);
  //   config.setNextRpcApi();
  //   wallet = getWallet(network);
  //   bridge = new ethers.Contract(bridgeAddress, bridgeAbi, wallet);
  //   console.log("Infura api key changed");
  // }
  return bridge;
};

export const getErc20BridgeInstance = (
  network: types.EvmChains,
  fromToken: any
) => {
  // const address = config.evmChainsInfo[network]!.bridgeAddress;
  const wallet = getWallet(network);
  // console.log("bridgeToken", bridgeToken);
  const bridgeAbi = getBridgeAbi("token" as bridges);
  // const bridge = new ethers.Contract(bridgeAddress, bridgeAbi, provider);
  const midTokenAddress = config.evmChainsInfo[network]!.supportedTokens.find(
    (token) => token.symbol == fromToken
  )?.address!;
  const bridge = new ethers.Contract(midTokenAddress, bridgeAbi, wallet);
  return bridge;
};

export const getAlchemyNetwork = (network: types.EvmChains) => {
  switch (network) {
    // case "eth":
    //   return alchemy.Network.ETH_MAINNET;
    case "poly":
      return alchemy.Network.MATIC_MAINNET;
    case "arb":
      return alchemy.Network.ARB_MAINNET;
    default:
      return undefined;
  }
};

export const getAlchemySDK = (network: types.EvmChains) => {
  const alchemyNetwork = getAlchemyNetwork(network);
  if (!alchemyNetwork) {
    return undefined;
  }
  const sdk = new alchemy.Alchemy({
    network: alchemyNetwork,
    apiKey: config.ALCHEMY_PROJECT_ID,
  });
  return sdk;
};

export const bridgeInterface = new ethers.utils.Interface(abis.spsSwidgeAbi);

export const getLogs = async (
  network: types.EvmChains,
  bridge: ethers.Contract,
  filter: ethers.EventFilter,
  fromBlock: number,
  toBlock: number
): Promise<types.Log[]> => {
  const interval = config.evmChainsInfo[network]!.eventPollingInterval;
  const provider = bridge.provider;
  const allLogs: types.Log[] = [];
  for (let i = fromBlock; i < toBlock; i += interval) {
    const logs = await provider.getLogs({
      ...filter,
      fromBlock: i,
      toBlock: i + interval,
    });
    allLogs.push(...logs);
  }
  return allLogs;
};

export const getLatestBlockNumber = async (
  network: types.EvmChains
): Promise<number> => {
  const provider = getProvider(network);
  const blockNumber = await provider.getBlockNumber();
  return blockNumber;
};

export const getBlockTimestamp = async (
  network: types.EvmChains,
  blockNumber: number
): Promise<number> => {
  const provider = getProvider(network);
  const block = await provider.getBlock(blockNumber);
  return block.timestamp;
};
