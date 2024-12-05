// home manu button
import { CHAIN_NAME } from "../../config/config";

import { botInfo } from "../../constant/botInfo";

export const homeButtons = [
  // [{ text: "Swap", web_app: { url: swapTokenBaseUrl } }],
  // [
  //   { text: "Buy Foxy", callback_data: "buyFoxy" },
  //   { text: "Sell Foxy", callback_data: "sellFoxy" },
  //   // { text: "Snipe Foxy", callback_data: "snipeFoxy" },
  // ],
  [
    // { text: "Transfer Token", callback_data: "trendingTokensTransfer" },
    { text: "👫 Refer to Friend", callback_data: "referToFriend"},
  ],
  [
    { text: "💼 Wallet", callback_data: "wallet" },
    { text: "🔄 Refresh", callback_data: "refreshHome" },
  ],
  [
    // { text: "See Pnl", web_app: { url: pnlUrl } }
    // { text: "See Pnl", callback_data: "seePnl" },
    { text: "❌ Close", callback_data: "cancel" },
  ],
];

// start manu button

export const startButtons = [
  [
    { text: "💸 Buy X GIB", callback_data: "Buy X GIB" },
    { text: "💰 Sell X GIB", callback_data: "Sell X GIB" },
  ],
  [
    { text: "🚀 Transfer X GIB", callback_data: "transfer GIB" },
    { text: "🚀 Transfer X Matic", callback_data: "transfer Matic" },
  ],
  [
    { text: "👫 Refer to Friend", callback_data: "referToFriend" },
    { text: "💼 Wallet", callback_data: "wallet" },
  ],
];

// button to route home and wallet

export const homeOrWalletButton = [
  [
    { text: "🏠 Home", callback_data: "home" },
    { text: "💼 Wallet", callback_data: "wallet" },
    { text: "❌ Close", callback_data: "cancel" }
  ],
];

// confirm to execute operation
export const confirmationButton = [
  [
    { text: "✅ Yes", callback_data: "yes" },
    { text: "❌ No", callback_data: "cancel" },
    // { text: "Cancel", callback_data: "cancel" },
  ],
];

export const transferTokenByWebAppButton = [
  [
    { text: "✅ Yes", callback_data: "yesTransferByWebApp" },
    { text: "❌ No", callback_data: "cancel" },
  ],
];

export const swapTokenByWebAppButton = [
  [
    { text: "✅ Yes", callback_data: "yesSwapByWebApp" },
    { text: "❌ No", callback_data: "cancel" },
  ],
];

export const transferNativeTokenButton = [
  [
    { text: "✅ Yes", callback_data: "yesTransferToken" },
    { text: "❌ No", callback_data: "cancel" },
  ],
];

// buttons with wallet information

export const walletButtons = [
  [
    {
      text: `Withdraw All ${
        botInfo[CHAIN_NAME as keyof typeof botInfo].nativeToken
      }`,
      callback_data: "transferAllnative",
    },
    {
      text: `Withdraw X ${
        botInfo[CHAIN_NAME as keyof typeof botInfo].nativeToken
      }`,
      callback_data: "transferXnative",
    },
  ],
  [
    // { text: "Deposit Token", callback_data: "deposit" },
    { text: "🔐 Export Private Key", callback_data: "export private key" },
  ],
  // [{ text: "Refresh", callback_data: "refreshWallet" }],
];

// gib approval button
export const approvalButton = [
  [
    { text: "Approve", callback_data: "approve" },
    { text: "Cancel", callback_data: "cancel" },
  ],
];

// private key export button
export const privateKeyShowCancelButton = [
  [
    { text: "Show", callback_data: "show" },
    { text: "❌ Cancel", callback_data: "cancel" },
  ],
];
export const privateAddressConfirmationButton = [
  [
    { text: "✅ Yes", callback_data: "show private key" },
    { text: "❌ No", callback_data: "cancel" },
    // { text: "Export with Funds", callback_data: "Export with Funds" },
  ],
];

// referral button
export const refferalButton = [
  [{ text: "👫 Refer to Friend", switch_inline_query: "Refer to Friend" }],
];

export const tokenInfoButton = [
  [
    { text: "💸 Buy", callback_data: "buyToken" },
    { text: "💰 Sell", callback_data: "sellToken" },
  ],
];

// signInButton Confirmation
export const signInButton = [
  [
    { text: "✅ Yes", callback_data: "secureSignIn" },
    { text: "❌ No", callback_data: "cancel" },
  ],
];

// selectedTokenButton
export const selectedTokenButton = [
  [
    // { text: "Transfer", callback_data: "transferToken" },
    // { text: "Buy", callback_data: "buyToken" },
    // { text: "Sell", callback_data: "sellToken" },
    { text: "Buy 0.001 ETH", callback_data: "buy 0.001" },
    { text: "Buy 0.01 ETH", callback_data: "buy 0.01" },
    { text: "Buy X ETH", callback_data: "buy X" },
  ],
  [
    // { text: "Transfer", callback_data: "transferToken" },
    // { text: "Buy", callback_data: "buyToken" },
    // { text: "Sell", callback_data: "sellToken" },
    { text: "💰 Sell 25%", callback_data: "sell 25%" },
    { text: "💰 Sell 50%", callback_data: "sell 50%" },
    { text: "💰 Sell X %", callback_data: "sell X%" },
  ],
];

// close button
export const closeButton = [[{ text: "❌ Close", callback_data: "cancel" }]];
