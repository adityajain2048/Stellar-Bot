import axios from "axios";
import { GOCKETERMINAL_URL } from "../config/config";
export const getTokensInfo = async (
  tokensAddress: string,
) => {
  try {
    const url = `https://api.geckoterminal.com/api/v2/networks/linea/tokens/multi/${tokensAddress}`;
    const tokenData = await axios.get(url);
    return tokenData?.data.data;
  } catch (error) {
    console.log("error in getting price..", error);
    return {};
  }
};
