import axios from "axios";
import { GOCKETERMINAL_URL } from "../config/config";
export const getTokensPrice = async (
  tokensAddress: string,
  coinGeckoTerminalChainName: string
) => {
  try {
    const url = `${GOCKETERMINAL_URL}/${coinGeckoTerminalChainName}/token_price/${tokensAddress}`;
    const tokenData = await axios.get(url);
    return tokenData?.data.data.attributes.token_prices;
  } catch (error) {
    console.log("error in getting price..", error);
    return {};
  }
};
