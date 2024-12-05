import { ITokenInfo } from "../../interface/tokenInfo.interface";
import { ethers } from "ethers";
import { botInfo } from "../../constant/botInfo";
import { CHAIN_NAME } from "../../config/config";

// checkig approval of Token
export const isTokenApproved = async (
  amount: number,
  walletAddress: any,
  spender: string,
  fromTokenInfo: ITokenInfo
) => {
  try {
    const RPC_URL = botInfo[CHAIN_NAME as keyof typeof botInfo].RPC_URL;
    // check if the token is native token
    if (
      fromTokenInfo.address.toLocaleLowerCase() ===
      "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
    )
      return true;
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
      walletAddress,
      spender
    );
    if (allowance > amount * 10 ** fromTokenInfo.decimal) {
      return true;
    }
    return false;
  } catch (error) {
    console.log("Error in approving amount..............", error);
    return false;
  }
};

// getting approval call data
export const getApprovalCallData = async (
  amount: number,
  keypair: any,
  spender: string,
  tokenInfo: ITokenInfo
) => {
  try {
    const erc20Abi = [
      // Some details about the token
      "function approve(address spender, uint256 amount) public returns(bool)",
    ];
    const contractInterface = new ethers.Interface(erc20Abi);

    // Encode the function call
    const data = contractInterface.encodeFunctionData("approve", [
      spender,
      ethers.parseUnits("1000000000000", tokenInfo.decimal),
    ]);

    const approvalData = {
      data: data,
      to: tokenInfo.address,
      value: "0",
    };

    return approvalData;
  } catch (error) {
    console.log("Error in getting approval txn..............", error);
    return {
      response: {
        status: false,
        message: "approval Txn failed",
      },
    };
  }
};
