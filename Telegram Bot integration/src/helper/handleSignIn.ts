import { singInObject } from "../constant/functionParameterObject";

export const handleSignIn = async (
  params: {
    mpin: any;
    reMpin: any;
  },
  chatBot: any,
  chatId: number,
  functionName: string,
  ctx: any
) => {
  try {
    ctx.session.trackObject.functionName = functionName;
    ctx.session.trackObject.functionParams = { ...params };
    ctx.session.trackObject.totalParams = singInObject.totalArguments;
    console.log("sendBalance...inside", params);

    if (!params.mpin) {
      console.log("handleSignIn...mpin");
      ctx.session.trackObject.lastParamIndex = 0;
      ctx.api.sendMessage(chatId, "enter 4 digit mpin");
      return "returning";
    }

    if (!params.reMpin) {
      console.log("handleSignIn...reMpin");
      ctx.session.trackObject.lastParamIndex = 1;
      ctx.api.sendMessage(
        chatId,
        "re-enter 4 digit mpin which should be same as mpin."
      );
      return "returning";
    }

    // comparing mpin and reMpin both should be same and not empty
    if (
      (params.mpin !== params.reMpin && params.mpin !== null) ||
      params.reMpin !== null
    ) {
      const transactionSummary = `Mpin is not same please enter 4 digit same mpin.`;
      ctx.api.sendMessage(chatId, transactionSummary);
    } else if (
      params.mpin === params.reMpin &&
      params.mpin !== null &&
      params.reMpin !== null
    ) {
      ctx.session.mpin = params.mpin;
      ctx.api.sendMessage(chatId, "Mpin is set successfully");
    }

    return "returning";
  } catch (error) {
    console.log("error in sendBalance data collection......", error);
    return "error in sending transactoin....";
  }
};
