// Function to extract wallet address from the /start command
export const extractChatIdFromStartCommand = (startCommand: string) => {
  try {
    const match = startCommand.match(/\/start (.+)/);
    if (match) {
      const referralParams = match[1].split(" ");
      return referralParams;
    }
    return null;
  } catch (error) {
    console.log("Error in extracting chat id from start command", error);
    return null;
  }
};
