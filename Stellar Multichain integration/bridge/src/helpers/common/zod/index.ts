import { z } from "zod";
import { config } from "..";

export const chainIds = z.enum(config.supportedChains);
export const address = z.string().regex(/^0x[a-fA-F0-9]{40}$/);
export const amount = z.string();

export const swapParams = z.object({
  chainId: chainIds,
  sellToken: address,
  buyToken: address,
  sellAmount: amount,
  slippagePercentage: z.number().min(0).max(0.01).default(0.005).optional(),
});

export const swap = z.object({
  body: swapParams,
});

export const xSwapParams = z.object({
  chainIdFrom: chainIds,
  chainIdTo: chainIds,
  fromToken: address,
  toToken: address,
  amountFrom: amount,
  fromuserAddress: address.optional().default("0x00"),
  touser: z.string().optional(),
});

export const xSwap = z.object({
  query: xSwapParams,
});

export const txnStatusParams = z.object({
  lockHash: z.string(),
});

export const txnStatus = z.object({
  query: txnStatusParams,
});

export const getTxn = z.object({
  params: z.object({
    lockHash: z.string().max(100)
  })
})
