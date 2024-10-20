import * as utils from "../utils";
import * as apis from "../apiCalls";
import { IBridgeTxn } from "../types";
import { config } from "..";

export const notifyBridgeTxTG = async (tx: any) => {
  let sender;
  if (tx.user.length == 42) {
    sender = `${tx.user.substring(0, 4)}...${tx.user.substring(38)}`;
  } else {
    sender = `${tx.user.substring(0, 4)}...${tx.user.substring(52)}`;
  }

  let recipient;
  if (tx.recipient.length == 42) {
    recipient = `${tx.recipient.substring(0, 4)}...${tx.recipient.substring(
      38
    )}`;
  } else {
    recipient = `${tx.recipient.substring(0, 4)}...${tx.recipient.substring(
      52
    )}`;
  }

  let lockHash;
  if (tx.lockHash.length == 66) {
    lockHash = `${tx.lockHash.substring(0, 4)}...${tx.lockHash.substring(62)}`;
  } else {
    lockHash = `${tx.lockHash.substring(0, 4)}...${tx.lockHash.substring(60)}`;
  }

  let releaseHash;
  if (tx.releaseHash.length == 66) {
    releaseHash = `${tx.releaseHash.substring(
      0,
      4
    )}...${tx.releaseHash.substring(62)}`;
  } else {
    releaseHash = `${tx.releaseHash.substring(
      0,
      4
    )}...${tx.releaseHash.substring(60)}`;
  }

  const fromToken = config.allChainsInfo[tx.fromNetwork]!.supportedTokens.find(
    (token: any) => token.symbol == tx.fromToken
  );
  const toToken = config.allChainsInfo[tx.toNetwork]!.supportedTokens.find(
    (token: any) => token.symbol == tx.toToken
  );

  const createdAt = tx.createdAt ? new Date(tx.createdAt).toUTCString() : "N/A";

  // Constructing the message using HTML format
  const message =
    `<b>Transaction #${tx.txNumber}</b>\n` +
    `<b>— — — — — — — — — — —</b>\n` +
    `<b>Date</b>: ${createdAt}\n` +
    `<b>Sending Address</b>: ${sender}\n` +
    `<b>Receiver Address</b>: ${recipient}\n` +
    `<b>Route</b>: ${tx.fromNetwork.toUpperCase()} > ${tx.toNetwork.toUpperCase()}\n` +
    `<b>Token</b>: ${tx.srcToken} > ${tx.toToken}\n` +
    `<b>Fee</b>: ${tx.lockFee} + ${tx.releaseFee}\n` +
    `<b>Cross Power</b>: ${tx.crossPower}\n` +
    `<b>Lock Amount</b>: ${tx.lockAmount}\n` +
    `<b>Release Amount</b>: ${tx.releaseAmount}\n` +
    `<b>Lock Hash</b>: ${lockHash}\n` +
    `<b>Release Hash</b>: ${releaseHash}`;

  console.log("Telegram message: ", message);
  // Send the message using HTML formatting
  await apis.telegram.sendTelegramMessage(message);
  console.log("Telegram notification sent");
};

export const notifyBridgeTxTGRemark = async (
  tx: IBridgeTxn,
  remark: string,
  tokenSymbol: string
) => {
  const message = `*Transaction #${tx.txNumber}*
*— — — — — — — — — — —*
*Date*: ${tx.createdAt?.toLocaleString()}
*Route*: ${tx.fromNetwork.toUpperCase()} > ${tx.toNetwork.toUpperCase()}
*Token*: $${tokenSymbol}
[User from](${utils.getExplorerAddressUrl(
    tx.user,
    tx.fromNetwork
  )}): \`${utils.shortAddr(tx.user)}\`
[User to](${utils.getExplorerAddressUrl(
    tx.user,
    tx.toNetwork
  )}): \`${utils.shortAddr(tx.user)}\`
*Amount*: ${utils.fromWeiReadable(
    tx.lockAmount,
    utils.getTokenDecimals(tx.fromNetwork)
  )}
[Lock](${utils.getExplorerTxUrl(
    tx.lockHash,
    tx.fromNetwork
  )}): \`${utils.shortAddr(tx.lockHash)}\`
*Error*: ❗${remark}
@yashm98 @bit_botanist
`;
  await apis.telegram.sendTelegramMessage(message);
};
