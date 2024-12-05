import { updateTokenPrice } from "../services/updateTokenPrice";
export const updateTokenPriceWorker = async () => {
  try {
    setInterval(async () => {
      console.log("Updating token price...");
      updateTokenPrice();
    }, 5000 * 10);
  } catch (error) {
    console.log("Error in updateTokenPriceWorker", error);
  }
  // update database in every 10 minutes
};
