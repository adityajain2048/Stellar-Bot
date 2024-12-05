import "dotenv/config";
import { config } from "../config";
export const CHAIN_NAME = process.env.CHAIN_NAME || "linea";
export const MORALIS_API_KEY = process.env.MORALIS_API_KEY;
export const MONGO_URL = config.MONGO_URL;
export const GOCKETERMINAL_URL =
  "https://api.geckoterminal.com/api/v2/simple/networks";

// frontend urls
export const pnlUrl = `https://inspiring-pixie-221e8e.netlify.app/pnl`;
export const transferReceiptBaseUrl =
  "https://inspiring-pixie-221e8e.netlify.app/transferReceipt";
export const swapReceiptBaseUrl =
  "https://inspiring-pixie-221e8e.netlify.app/swapReceipt";
export const transferTokenBaseUrl =
  "https://inspiring-pixie-221e8e.netlify.app/tokenList";
export const swapTokenBaseUrl =
  "https://inspiring-pixie-221e8e.netlify.app/swap";
export const PORT = process.env.PORT;

export const GIB_REWARD_ACCOUNT = process.env.GIB_REWARD_ACCOUNT;
export const PORFO_ACCOUNT_ADD = process.env.PORFO_ACCOUNT_ADD;

export const COVALENT_API_KEY = process.env.COVALENT_API_KEY;

// snipping foxy contract address below currently my wallet address used.
export const foxy_contract_address =
  "0x4f250068dfD4BDc8B15d414BD6C1dE0e48B6deBa";
export const REDIS_URL = process.env.REDIS_URL;
