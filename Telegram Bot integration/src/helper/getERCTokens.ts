import axios from "axios";
import { MORALIS_API_KEY } from "../config/config";
export const getERCTokens = async (address: string) => {
  try {
    // write code for getting price of gib by moralis api
    const options = {
      headers: {
        accept: "application/json",
        "X-API-Key": MORALIS_API_KEY,
      },
    };
    const moralisApi = "https://deep-index.moralis.io/api/v2/";
    const url = moralisApi + address + "/erc20?chain=" + "polygon";
    let data = (await axios.get(url, options)).data;
    if (data.length > 0) {
      let gibBalance = 0;
      for (let i = 0; i < data.length; i++) {
        if (
          data[i].token_address === "0x3efcd659b7a45d14dda8a102836ce4b765c42324"
        ) {
          gibBalance = parseFloat((data[i].balance / 10 ** 18).toFixed(5));
          break;
        }
      }
      return gibBalance;
    } else {
      return 0;
    }
  } catch (error) {
    console.log("error in getting erc tokens balance", error);
    return 0;
  }
};
