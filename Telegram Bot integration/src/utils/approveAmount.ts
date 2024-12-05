import { ethers } from "ethers";
import { ITokenInfo } from "../interface/tokenInfo.interface";
import { botInfo } from "../constant/botInfo";
import { CHAIN_NAME } from "../config/config";

export const approveAmount = async (
  amount: number,
  saAddress: any,
  fromTokenInfo: ITokenInfo
) => {
  try {
    const RPC_URL = botInfo[CHAIN_NAME as keyof typeof botInfo].RPC_URL;
    console.log("inside approveAmount......",amount,saAddress,fromTokenInfo.address);
    //approve amount using ethers contract for GIB token
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const contractAddress = fromTokenInfo.address;
    //check if the current allowance is less than amount then do the actual approval transaction
    const contractRead = new ethers.Contract(
      contractAddress,
      [
        "function allowance(address owner, address spender) public view returns (uint256)",
      ],
      provider
    );

    const allowance = await contractRead.allowance(
      saAddress,
      "0x1111111254eeb25477b68fb85ed929f73a960582"
    );
    if (allowance >= amount * 10 ** fromTokenInfo.decimal) {
      return true;
    }
    return false;
  } catch (error) {
    console.log("Error in approving amount..............", error);
    return false;
  }
};
