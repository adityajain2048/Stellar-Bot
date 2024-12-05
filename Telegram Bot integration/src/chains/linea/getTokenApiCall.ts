import axios from "axios";
import { tokenInfoUrl } from "./config";
export const getTokenApiCall = async (tokenAddress: string) => {
  try {
    const response = await axios.get(`${tokenInfoUrl}/${tokenAddress}`);
    return response.data;
  } catch (error) {
    console.log("Error in getToken api call..............", error);
    return {
      data: [],
    };
  }
};
