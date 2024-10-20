import Big from "big.js";
import { BigNumber } from "ethers";

export const big = (value: string | number | BigNumber | Big): Big => {
  return Big(value.toString());
};

export const fromWei = (
  value: string | number | BigNumber | Big,
  decimals = 18
): Big => {
  return big(value).div(Math.pow(10, decimals));
};

export const toWei = (
  value: string | number | BigNumber | Big,
  decimals = 18
): Big => {
  return big(value).mul(Math.pow(10, decimals)).round(0, 0); // wei cannot be in decimal
};

export const stringify = (value: string | number | BigNumber | Big): string => {
  return big(value).toFixed();
};

export const numerify = (value: string | number | BigNumber | Big): number => {
  return +big(value).toFixed();
};

export const fromWeiStr = (
  value: string | number | BigNumber | Big,
  decimals = 18
): string => {
  return stringify(fromWei(value, decimals));
};

export const toWeiStr = (
  value: string | number | BigNumber | Big,
  decimals = 18
): string => {
  return stringify(toWei(value, decimals));
};

export const balanceDecimals = (
  amount: string | number | BigNumber | Big,
  fromDecimals: number,
  toDecimals: number
): Big => {
  if (toDecimals < fromDecimals) {
    return big(amount)
      .div(big(10).pow(fromDecimals - toDecimals))
      .round(0, 0);
  } else {
    return big(amount)
      .mul(big(10).pow(toDecimals - fromDecimals))
      .round(0, 0);
  }
};
export const fromWeiReadable = (
  value: string | number | BigNumber | Big,
  decimals = 18,
  precision?: number
): number => {
  const v = fromWei(value, decimals);
  if (!precision) {
    if (v.lt(1)) return +v.toFixed(6);
    if (v.lt(100)) return +v.toFixed(4);
    return +v.toFixed(2);
  } else {
    return +v.toFixed(precision);
  }
};

export const toUnits = (
  value: string | number | BigNumber | Big,
  decimals: number
) => {
  const denominator = big("10").pow(decimals);
  const numerator = big(value.toString());
  const result = numerator.div(denominator);
  return stringify(result);
};
