import { z, AnyZodObject } from "zod";
import * as validations from "../zod";
import ethers from "ethers";

export type zodObject = AnyZodObject;
export type ChainIds = z.infer<typeof validations.chainIds>;
export type Address = z.infer<typeof validations.address>;
export type Amount = z.infer<typeof validations.amount>;
export type SwapParams = z.infer<typeof validations.swapParams>;
export type SwapResponse = {
  buyTokenAddress: string;
  sellTokenAddress: string;
  buyAmount: string;
  sellAmount: string;
  data: string;
};

export type XSwapParams = z.infer<typeof validations.xSwapParams>;
export type BridgeOutputEstimate = {
  amountToReceive: ethers.BigNumberish;
  bridgeFee: ethers.BigNumberish;
};
