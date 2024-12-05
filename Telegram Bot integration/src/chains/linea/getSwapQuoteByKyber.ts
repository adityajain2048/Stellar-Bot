import axios from "axios";
import { ethers } from "ethers";
export const getSwapQuoteByKyber = async (
  amount: number,
  fromTokenInfo: any,
  toTokenInfo: any,
  walletAddress: string
) => {
  try {
    const res = await axios.get(
      `https://aggregator-api.kyberswap.com/linea/api/v1/routes?tokenIn=${
        fromTokenInfo.address
      }&tokenOut=${toTokenInfo.address}&amountIn=${
        amount * 10 ** fromTokenInfo.decimal
      }`
    );

    const callDataObject = await getSwapCallData(
      res.data.data.routeSummary,
      walletAddress,
      fromTokenInfo,
      amount,
      res.data.data.routerAddress
    );
    return {
      response: {
        status: true,
        message: callDataObject,
        routerAddress: res.data.data.routerAddress,
      },
    };
  } catch (error) {
    console.log("Error in getting quote..............", error);
    return {
      response: {
        status: false,
        message: "Finding too much volatility . Please try again",
        routerAddress: "",
      },
    };
  }
};

const getSwapCallData = async (
  routeSummary: any,
  walletAddress: string,
  fromTokenInfo: any,
  amount: number,
  routerAddress: string
) => {
  try {
    const response = await fetch(
      "https://aggregator-api.kyberswap.com/linea/api/v1/route/build",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          routeSummary: routeSummary,
          sender: walletAddress,
          recipient: walletAddress,
          slippageTolerance: 300,
        }),
      }
    );

    const responoseData = await response.json();
    const data = responoseData.data;
    const callData = data.data;
    const callDataObject = {
      from: walletAddress,
      to: routerAddress, //this is the only contract you can use if you decide to make transaction by our API.
      value:
        fromTokenInfo.address == "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
          ? amount * 10 ** 18
          : 0,
      data: callData,
    };

    // return { response: { status: true, message: callDataObject } };
    return callDataObject;
  } catch (error) {
    console.log("Error in getting quote......during build........", error);
    return "Finding too much volatility . Please try again";
  }
};
