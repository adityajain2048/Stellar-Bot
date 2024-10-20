import uniSwapAbi from "./uniswapAbi.json";
import spsSwidgeAbi from "./swidge.json";
import xSwapAbi from "./crossSwapAbi.json";
import GLSBridge from "./GLSBridge.json";
import swidge from "./swidge.json";
import erc20Token from "./erc20Token.json";

export const bridges = [
  "eth",
  "matic",
  "bnb",
  "token",
  "glx",
  "glusd",
] as const;
export type bridges = (typeof bridges)[number];

const bridge = {
  eth: swidge,
  matic: swidge,
  bnb: swidge,
  token: erc20Token,
  glx: GLSBridge,
  glusd: GLSBridge,
};
const abis = {
  uniSwapAbi,
  spsSwidgeAbi,
  xSwapAbi,
  bridge,
};
export default abis;
