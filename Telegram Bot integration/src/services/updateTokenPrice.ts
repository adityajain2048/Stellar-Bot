import { getTokensPrice } from "../apiCalls/getTokensPrice";
import { getTokenModel } from "../models/tokenSchema";
import { tokenInfo } from "../constant/tokenInfo";
import { redisInstance } from "../config/redis";
import axios from "axios";
import { getTokensInfo } from "../apiCalls/getTokensInfo";
import { largeDataFormator } from "../utils/largeDataFormator";
export const updateTokenPrice = async () => {
  try {
    // getting token price by calling getTokensPrice function
    // itenrating tokenInfo object and taking chain name and token information
    for (const chainName in tokenInfo) {
      // taking one varialble to store token address as key and symbol and price as value
      let redisTokenPrice = {};
      const CHAIN_NAME = chainName;
      const tokensObject = tokenInfo[chainName as keyof typeof tokenInfo];
      let tokens = null;
      // getting tokens from db
      const tokenModel = getTokenModel(CHAIN_NAME);
      tokens = await tokenModel.find();
      if (!tokens) {
        tokens = tokensObject.tokens;
      }
      const coinGeckoTerminalChainName = tokensObject.geckoterminalchain;
      let tokenAddress = "";
      // getting token address from tokens
      for (let i = 0; i < tokens.length; i++) {
        tokenAddress += "%2C" + tokens[i].address;
      }
      // removing first %2C from token address
      tokenAddress = tokenAddress.substring(3);
      const tokenPrice = await getTokensPrice(
        tokenAddress,
        coinGeckoTerminalChainName
      );

      // getting tokenInfo
      const tokenInfoMCap = await getTokensInfo(tokenAddress);
      // console.log("inside update token price....", tokenInfoMCap);
      // getting current timestamp
      const currentTime = new Date().getTime();
      // console.log("current time stamp....", currentTime);
      const tokenPriceFromRedis = await redisInstance.get(`${CHAIN_NAME}`);
      const tokenPriceData = JSON.parse(tokenPriceFromRedis);
      for (let i = 0; i < tokens?.length; i++) {
        // creating tokenRedisInfo object contains symbol and price
        const tokenPriceInfo = {};
        const token = tokens[i];

        token.address = token.address.toLowerCase();
        token["price"] = Number(tokenPrice[token.address.toLowerCase()]);
        tokenPriceInfo["price"] = tokenPrice[token.address.toLowerCase()];

        // getting market cap and fdv
        for (let j = 0; j < tokenInfoMCap.length; j++) {
          if (
            tokenInfoMCap[j].attributes.address.toLocaleLowerCase() ===
            token.address.toLocaleLowerCase()
          ) {
            tokenPriceInfo["marketCap"] = largeDataFormator(
              tokenInfoMCap[j].attributes.market_cap_usd
            );
            tokenPriceInfo["fdv"] = largeDataFormator(
              tokenInfoMCap[j].attributes.fdv_usd
            );
            break;
          }
        }
        // tokenPriceInfo["marketCap"] = marketCap;
        // find and update token price in the database
        await tokenModel.findOneAndUpdate(
          { address: token.address.toLocaleLowerCase() },
          token,
          { upsert: true }
        );

        if (tokenPriceData) {
          // checking price current
          // console.log("inside tokenPriceData....", tokenPriceData[token.address])
          const tokenPInfo = tokenPriceData[token.address];
          if (tokenPInfo) {
            if (tokenPInfo["5m"].timestamp < currentTime - 5 * 60 * 1000) {
              tokenPriceInfo["5m"] = {
                price: tokenPrice[token.address.toLowerCase()],
                timestamp: currentTime,
              };
            } else {
              tokenPriceInfo["5m"] = {
                price: tokenPInfo["5m"].price,
                timestamp: tokenPInfo["5m"].timestamp,
              };
            }
            // similar to 1h
            if (tokenPInfo["1h"].timestamp < currentTime - 60 * 60 * 1000) {
              tokenPriceInfo["1h"] = {
                price: tokenPrice[token.address.toLowerCase()],
                timestamp: currentTime,
              };
            } else {
              tokenPriceInfo["1h"] = {
                price: tokenPInfo["1h"].price,
                timestamp: tokenPInfo["1h"].timestamp,
              };
            }
            // similar to 6h
            if (tokenPInfo["6h"].timestamp < currentTime - 6 * 60 * 60 * 1000) {
              tokenPriceInfo["6h"] = {
                price: tokenPrice[token.address.toLowerCase()],
                timestamp: currentTime,
              };
            } else {
              tokenPriceInfo["6h"] = {
                price: tokenPInfo["6h"].price,
                timestamp: tokenPInfo["6h"].timestamp,
              };
            }
            // smilar to 24h
            if (
              tokenPInfo["24h"].timestamp <
              currentTime - 24 * 60 * 60 * 1000
            ) {
              tokenPriceInfo["24h"] = {
                price: tokenPrice[token.address.toLowerCase()],
                timestamp: currentTime,
              };
            } else {
              tokenPriceInfo["24h"] = {
                price: tokenPInfo["24h"].price,
                timestamp: tokenPInfo["24h"].timestamp,
              };
            }
          } else {
            // update price for 5m
            tokenPriceInfo["5m"] = {
              price: tokenPrice[token.address.toLowerCase()],
              timestamp: currentTime,
            };
            // update price for 1h
            tokenPriceInfo["1h"] = {
              price: tokenPrice[token.address.toLowerCase()],
              timestamp: currentTime,
            };
            // update price for 6h
            tokenPriceInfo["6h"] = {
              price: tokenPrice[token.address.toLowerCase()],
              timestamp: currentTime,
            };
            // update price for 24h
            tokenPriceInfo["24h"] = {
              price: tokenPrice[token.address.toLowerCase()],
              timestamp: currentTime,
            };
          }
        } else {
          // update price for 5m
          tokenPriceInfo["5m"] = {
            price: tokenPrice[token.address.toLowerCase()],
            timestamp: currentTime,
          };
          // update price for 1h
          tokenPriceInfo["1h"] = {
            price: tokenPrice[token.address.toLowerCase()],
            timestamp: currentTime,
          };
          // update price for 6h
          tokenPriceInfo["6h"] = {
            price: tokenPrice[token.address.toLowerCase()],
            timestamp: currentTime,
          };
          // update price for 24h
          tokenPriceInfo["24h"] = {
            price: tokenPrice[token.address.toLowerCase()],
            timestamp: currentTime,
          };
        }
        // console.log("tokenPriceInfo....", tokenPriceInfo);
        redisTokenPrice[token.address] = tokenPriceInfo;
        // conpare current time with last updated time
        // update token price in redis
      }
      await redisInstance.set(`${CHAIN_NAME}`, JSON.stringify(redisTokenPrice));
    }
  } catch (error) {
    console.log("error in update token price...", error);
    return {};
  }
};
