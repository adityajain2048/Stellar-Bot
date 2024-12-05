import axios from "axios";
import { ethers } from "ethers";

export const getSwapQuote = async (
  amount: number,
  fromTokenInfo: any,
  toTokenInfo: any,
  walletAddress: string
) => {
  try {
    let params = {
      chain: "linea",
      inTokenAddress: fromTokenInfo.address,
      outTokenAddress: toTokenInfo.address,
      amount: amount,
      gasPrice: 5,
      slippage: 5,
      account: walletAddress
    };
    
    console.log("getSwapQuote params..............", amount, fromTokenInfo, toTokenInfo, walletAddress);
    
    const res = await axios.get(
      "https://open-api.openocean.finance/v3/linea/swap_quote",
      { params }
    );
    console.log("inside getSwapQuote..............", res);
    if (res) {
      const { estimatedGas, data, gasPrice } = res.data.data;
      const swapParams = {
        from: walletAddress,
        to: "0x6352a56caadc4f1e25cd6c75970fa768a3304e64", //this is the only contract you can use if you decide to make transaction by our API.
        gas: estimatedGas,
        gasPrice: gasPrice,
        value:
          fromTokenInfo.address == "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
            ? ethers.parseEther("" + amount)
            : 0,
        data,
      };
      // return res.data;
      return { response: { status: true, message: swapParams } };
    } else {
      return {
        response: {
          status: false,
          message: "Finding too much volatility . Please try again",
        },
      };
    }
  } catch (error) {
    console.log("Error in getting quote..............", error);
    return {
      response: {
        status: false,
        message: "Finding too much volatility . Please try again",
      },
    };
  }
};
