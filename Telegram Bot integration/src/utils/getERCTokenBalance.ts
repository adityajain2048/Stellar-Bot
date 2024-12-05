import axios from "axios";
import { MORALIS_API_KEY } from "../config/config";

export const getERCTokenBalance = async (address:string) => {
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
    if (data) {
      return data;
    } else {
      return [];
    }
  } catch (error) {
    console.log("Error in getting erc20 token balance", error);
  }
};
