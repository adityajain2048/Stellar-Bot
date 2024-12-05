import { CHAIN_NAME } from "../config/config";
import { botInfo } from "./botInfo";

export const helpMsg = `About POLYSIDE
polySIDE bot is the fastest bot on SUI to trade tokens over chat. It is first LLM based bot on Polygon to trade tokens in natural language.

With polySIDE bot you can buy, sell and get info about tokens using natural language, or commands interface built right into Telegram.
You can trade tokens with the /buy, /sell, and /swap commands, as well as a variety of flexible, natural language alternatives. These are described below.
/buy
You buy tokens with a variety of commands and natural language.
*       buy GIB
*       buy 10 GIB with MATIC

/sell
You can sell tokens with a variety of commands and natural language.
*       sell GIB
*       sell 1 GIB to MATIC
*       i'd like to sell some MATIC please and thank you
/swap
Swap tokens, a convenient alternative to /buy and /sell, with the following commands and natural language.
*       swap
*       swap 1 MATIC to GIB
*       swap 10 GIB for MATIC
*       swap 1 MATIC to GIB
/info
Get at-a-glance info about tokens. You can use token symbols, CAs or Birdeye links.
*       MATIC
*       /info MATIC
*       jtojtomepa8beP8AuQc6eXt5FriJwfFMwQx2v2f9mCL
*       what's the latest with polySIDE`;

export const welcomeMsgPolySideFirst = `
Let’s get started!

🟣 You currently have <b>0 MATIC</b> balance. To begin trading, send some Matic to your generated wallet address:

<code>{{walletAddress}}</code>

📲 (tap above address to copy)

🔄 Once done tap refresh and your balance will appear here.

🔑 Click on the wallet button to get info of your wallet or export the private key of your self custodial wallet.
`;

export const welcomeMsgPolySideSecond = `
👋 GM from  GibBot, your smart trading bot on Polygon! 

🤖 Place A Trade (Buy/Sell), Swap and Calculate PNL 

🟣 You currently have <b>{{amount}} Matic</b> balance. To begin trading, enter the Contract address and amount:

<code>{{walletAddress}}</code>

📲 (tap above address to copy)

🔑 Click on the wallet button to get info of your wallet or export the private key of your self custodial wallet.
`;

// const imageUrl = 'https://img.hotimg.com/WhatsApp-Image-2024-02-28-at-4.49.23-PM.jpeg';
export const infoMsg = `
👋 Hello, this is GibBot, your smart trading bot on Polygon! 
🤖 I can Trade (Buy/Sell), Swap and Calculate PNL 
🐒 Type /start to begin interaction. 
`;

export const buySellMsgObject = {
  buy: {
    inputText: `Enter Eth amount to buy`,
    confirmationMsg: `Buying {{tokenName}} for {{amount}} {{nativeTokenName}}.\n\nPlease confirm transaction`,
  },
  sell: {
    inputText: `Enter amount in percentage to sell. no need to enter % sign.`,
    confirmationMsg: `Selling {{amount}} {{tokenName}} to {{nativeTokenName}}.\n\nPlease confirm transaction`,
  },
};

export const privateKeyMessage = `Important Notice Before Exporting Your Key

Your wallet operates on a smart contract, making it a "Smart Account Wallet." When you choose to export your key, what you're actually receiving is the key to your Vault address, not the smart account itself.

What's a Vault?

A Vault is your personal storage on the blockchain, controlled by an External Owned Account (EOA).
It's separate from your smart account but can securely hold all your assets.
What Happens If You Export?
Exporting your key:

Transfers all assets from your smart account to your Vault (EOA).
Grants you the private key to the Vault for full control over these assets.
Would you like to proceed and export your wallet key, transferring your assets to the Vault?`;

export const notEnoughBalance = `😢 Oops! Looks like you don't have enough ${botInfo[CHAIN_NAME as keyof typeof botInfo].nativeToken}! To trade, you need some ${
  botInfo[CHAIN_NAME as keyof typeof botInfo].nativeToken} in your wallet. Here’s what you can do:\nTap to copy your wallet address. <code>{{walletAddress}}</code>

Add ${botInfo[CHAIN_NAME as keyof typeof botInfo].nativeToken}: Deposit some ${botInfo[CHAIN_NAME as keyof typeof botInfo].nativeToken} to continue trading. Need help? Visit our guide on adding ${
  botInfo[CHAIN_NAME as keyof typeof botInfo].nativeToken} to your wallet.

🌉 Exciting Update Coming! Stay tuned for our upcoming ${botInfo[CHAIN_NAME as keyof typeof botInfo].nativeToken} bridge, making it even easier to fund your wallet. Coming soon! 🌟`;


export const referToFriendMsg = `
Your Reflink: {{botReferLink}}

Referrals: {{referralCount}}
Lifetime ${botInfo[CHAIN_NAME as keyof typeof botInfo].nativeToken} earned: {{referralEarned}} ${botInfo[CHAIN_NAME as keyof typeof botInfo].nativeToken}

Refer your friends and earn rewards! Get 30% of their trading fees during their first month, 20% in the second month, and 10% forever after!
`
