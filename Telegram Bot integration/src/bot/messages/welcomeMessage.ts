import { CHAIN_NAME } from "../../config/config";
import { botInfo } from "../../constant/botInfo";
export const firstWelcomeMessage = 
`Welcome to ${botInfo[CHAIN_NAME as keyof typeof botInfo].botName}, your ${botInfo[CHAIN_NAME as keyof typeof botInfo].nativeToken} trading companion.

🟣Current Balance: 0 ${botInfo[CHAIN_NAME as keyof typeof botInfo].nativeToken}
To start trading, please send ${botInfo[CHAIN_NAME as keyof typeof botInfo].nativeToken} to your wallet address:

<code>{{walletAddress}}</code> (Tap on address to copy)

🔄Refresh Your Balance: Tap the refresh button to update your wallet balance instantly.

🔑 Manage Your Wallet: To manage your wallet click on the wallet button. Remember, your wallet is self-custodial.

<b>Powered by Biconomy's account abstraction.</b>`




export const secondWelcomeMsg = `
👋 GM from  ${botInfo[CHAIN_NAME as keyof typeof botInfo].nativeToken}, your smart trading bot on ${CHAIN_NAME}! 

🤖 Place A Trade (Buy/Sell), Swap and Calculate PNL 

🟣 You currently have <b>{{amount}} ${botInfo[CHAIN_NAME as keyof typeof botInfo].nativeToken}</b> balance. To begin trading, enter the Contract address and amount:

<code>{{walletAddress}}</code>

📲 (tap above address to copy)

🔑 Click on the wallet button to get info of your wallet or export the private key of your self custodial wallet.

Account abstraction powered By <b>Biconomy</b>
`;

export const helpMessage=`Which tokens can I trade?
You can trade any ERC-20 token that pairs with ${botInfo[CHAIN_NAME as keyof typeof botInfo].nativeToken} on major decentralised exchanges such as Uniswap, Sushiswap, and Balancer. We instantly support Uniswap pairs and other DEX pairs are updated within approximately 15 minutes.

How can I see how much money I've made from referrals?
Check the referrals section by clicking the referrals button to see your earnings in Linea!

I want to create a new wallet on ${botInfo[CHAIN_NAME as keyof typeof botInfo].botName}.
Simply click the Wallet button or type /wallet, and you will be guided through the process of setting up your new wallets.
Is ${botInfo[CHAIN_NAME as keyof typeof botInfo].botName} free? How much do I pay for transactions?

${botInfo[CHAIN_NAME as keyof typeof botInfo].botName} is free to use! We apply a transaction fee of 1% to help maintain the bot and provide services to everyone.

Why is my net profit lower than expected?
Your net profit is calculated after deducting all related costs, such as Price Impact, Transfer Tax, DEX Fees, and a 1% ${botInfo[CHAIN_NAME as keyof typeof botInfo].botName} fee. This ensures the profit you see reflects the true amount you receive, accounting for all transaction expenses.

Further questions? Join our Telegram group: https://t.me/+59VpJVAZh6o5NzM9
`
