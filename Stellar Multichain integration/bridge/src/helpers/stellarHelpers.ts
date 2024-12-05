import * as StellarSdk from "@stellar/stellar-sdk";
import constraints from "../constraints";
import { envConfigs } from "./common/envConfigs";
import { utils, types, config } from "./common";
import { BridgeTxn, IBridgeTxn } from "../db/models/bridgeTxnsModel";
import fs from "fs";
import { big } from "./common/utils";
import * as redis from "../redis";

export const getFeeByHashStellar = async (hash: string) => {
  const server = new StellarSdk.Horizon.Server(
    constraints.stellarConstraints.horizonServer
  );
  const transaction = await server.transactions().transaction(hash).call();
  const feeInStroops = transaction.fee_charged;
  console.log("Fee Stroops: ", feeInStroops.toString());
  const decimals = 10 ** config.nonEvmChainsInfo["stellar"]!.mainToken.decimals;
  const totalFee = big(feeInStroops.toString()).div(big(decimals.toString()));
  const prices = await redis.getCoinPricesCache();
  const totalFeeInUsd = utils.stringify(totalFee.mul(prices["stellar"]));
  return utils.stringify(totalFeeInUsd);
};

export const saveStellarEvents = async (events: any, server: any) => {
  try {
    const txns: IBridgeTxn[] = [];
    for (let event of events) {
      const fromToken = event.destToken;
      const lockId = utils.createLockId({
        network: "stellar",
        tokenSymbol: fromToken,
        transactionHash: event.txHash,
        logIndex: event.ledger,
      });
      const fromNetwork = "stellar";

      const toNetwork = event.toChain;
      console.log("toNetwork: ", toNetwork);

      const user = event.userAddress;
      console.log("srcToken: ", event.srcToken);

      const srcToken = utils.getSymbolfromTokenAddress(
        "stellar",
        event.srcToken
      );
      console.log("srcToken: ", srcToken);

      const srcAmount = event.amountIn;

      const toToken = utils.getSymbolfromTokenAddress(toNetwork, event.toToken);
      console.log("toToken: ", toToken);

      const lockAmount = event.swappedAmount;

      const lockHash = event.txHash;

      const transactionIndex = event.ledger;

      const blockNumber = event.ledger.toString();

      const timestamp = new Date(event.ledgerClosedAt).getTime();

      const recipient = event.receipentAddress;

      const processed = false;
      const retries = 0;
      const lockFee = await getFeeByHashStellar(event.txHash);
      const txn: types.IBridgeTxn = {
        lockId,
        fromNetwork,
        toNetwork,
        user,
        lockFee,
        recipient,
        fromToken,
        srcToken,
        srcAmount,
        toToken,
        lockAmount,
        lockHash,
        transactionIndex,
        blockNumber,
        timestamp,
        //default values
        processed,
        retries,
      };
      txns.push(txn);
    }
    const savedLogs = await BridgeTxn.create(txns);

    return savedLogs;
  } catch (err: any) {
    console.log("Error while saving new event: ", err.message);
    // throw new Error(err.message);
  }
};

export const release = async (
  amount: string,
  toAddress: string,
  token: string
) => {
  try {
    const server = new StellarSdk.Horizon.Server(
      constraints.stellarConstraints.horizonServer
    );
    const SorobanServer = new StellarSdk.SorobanRpc.Server(
      constraints.stellarConstraints.sorobanServer
    );
    const networkPassphrase = StellarSdk.Networks.PUBLIC;

    const sourceKeypair = StellarSdk.Keypair.fromSecret(
      envConfigs.stellarAccountSecret
    );
    console.log("public key: ", sourceKeypair.publicKey());
    const sourceAccount = await server.loadAccount(sourceKeypair.publicKey());
    console.log("Amount: ", amount);
    console.log("To Address: ", toAddress);
    console.log("token: ", token);

    const args = [
      StellarSdk.nativeToScVal(amount, { type: "i128" }),
      StellarSdk.nativeToScVal(toAddress, { type: "address" }),
      StellarSdk.nativeToScVal(token, { type: "address" }),
    ];
    const contract = config.nonEvmChainsInfo["stellar"]!.bridgeAddress;
    console.log("Contract id: ", contract);

    // Build the transaction
    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: (await server.fetchBaseFee()).toString(),
      networkPassphrase,
    })
      .addOperation(
        StellarSdk.Operation.invokeContractFunction({
          function: "release",
          contract,
          args,
        })
      )
      .setTimeout(200)
      .build();
    console.log("transaction: ", transaction);

    const readytrx = await SorobanServer.prepareTransaction(transaction);
    console.log("readytrx 1: ", readytrx);

    readytrx.sign(sourceKeypair);
    console.log("readytrx 2: ", readytrx);
    const txn = await server.submitTransaction(readytrx);
    return txn;
  } catch (error: any) {
    console.error("Transaction failed:", error.response.data);

    if (error.response && error.response.data && error.response.data.extras) {
      const resultCodes = error.response.data.extras.result_codes;
      console.error("Result codes:", resultCodes);

      if (resultCodes.transaction) {
        console.error("Transaction error code:", resultCodes.transaction);
      }

      if (resultCodes.operations && resultCodes.operations.length > 0) {
        console.error("Operation error codes:", resultCodes.operations);
      }
    }
    throw new Error(error);
  }
};

export const claim = async () => {
  const server = new StellarSdk.Horizon.Server(
    constraints.stellarConstraints.horizonServer
  );
  const SorobanServer = new StellarSdk.SorobanRpc.Server(
    constraints.stellarConstraints.sorobanServer
  );
  const networkPassphrase = StellarSdk.Networks.PUBLIC;

  const sourceKeypair = StellarSdk.Keypair.fromSecret(
    envConfigs.stellarAccountSecret
  );
  console.log("public key: ", sourceKeypair.publicKey());
  const sourceAccount = await server.loadAccount(sourceKeypair.publicKey());

  // Build the transaction
  const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
    fee: (await server.fetchBaseFee()).toString(),
    networkPassphrase,
  })
    .addOperation(
      StellarSdk.Operation.invokeContractFunction({
        function: "claim",
        contract: constraints.stellarConstraints.contractId,
        args: [],
      })
    )
    .setTimeout(180)
    .build();

  try {
    // Prepare the transaction
    const readytrx = await SorobanServer.prepareTransaction(transaction);

    // Sign the transaction AFTER preparation
    readytrx.sign(sourceKeypair);

    // Submit the transaction to the Stellar network
    const txn = await server.submitTransaction(readytrx);
    console.log("Claimed");
  } catch (error: any) {
    console.error("Transaction failed:", error.response.data);

    if (error.response && error.response.data && error.response.data.extras) {
      const resultCodes = error.response.data.extras.result_codes;
      console.error("Result codes:", resultCodes);

      if (resultCodes.transaction) {
        console.error("Transaction error code:", resultCodes.transaction);
      }

      if (resultCodes.operations && resultCodes.operations.length > 0) {
        console.error("Operation error codes:", resultCodes.operations);
      }
    }
    throw new Error(error);
  }
};

export const parseStellarEvent = (event: any) => {
  const destToken = "USDC";
  const ledger = event.ledger;
  fs.writeFileSync("exampleEvent.json", JSON.stringify(event));
  const ledgerClosedAt = event.ledgerClosedAt;
  const eventName = bufferToEventName(event.topic[0]._value);

  console.log("eventName: ", eventName);

  if (eventName != "LockEvent") {
    return;
  }
  const userAddress = bufferToPublicKey(event.topic[1]._value._value._value);
  console.log("userAddress: ", userAddress);

  const toToken = bufferToString(event.topic[2]._value);
  console.log("toToken: ", toToken);

  const amountIn = bufferToInteger(event.topic[3]);
  console.log("amountIn: ", amountIn);

  const swappedAmount = bufferToInteger(event.topic[4]);
  console.log("swappedAmount: ", swappedAmount);

  const receipentAddress = bufferToString(event.topic[5]._value);
  console.log("toToken: ", toToken);

  const toChain = bufferToChain(event.topic[6]._value);
  console.log("toChain: ", toChain);

  console.log("src input: ", event.topic[7]);
  const srcToken = bufferToHash(event.topic[7]._value._value);
  console.log("srcToken: ", srcToken);

  console.log("receipentAddress: ", receipentAddress);

  const txHash = event.txHash;
  console.log("txHash: ", txHash);

  return {
    ledger,
    ledgerClosedAt,
    eventName,
    destToken,
    userAddress,
    srcToken,
    amountIn,
    swappedAmount,
    toToken,
    toChain,
    receipentAddress,
    txHash,
  };
};

const bufferToString = (buffer: number[]) => {
  const string = Buffer.from(buffer).toString();
  return string;
};

const bufferToHash = (buffer: number[]) => {
  const string = StellarSdk.StrKey.encodeContract(Buffer.from(buffer));
  return string;
};

const bufferToPublicKey = (buffer: number[]) => {
  const string = StellarSdk.StrKey.encodeEd25519PublicKey(Buffer.from(buffer));
  return string;
};

const bufferToEventName = (buffer: number[]) => {
  return Buffer.from(buffer).toString();
};

const bufferToInteger = (value: any) => {
  const val = value._value;
  const hi = BigInt(val._attributes.hi._value);
  const lo = BigInt(val._attributes.lo._value);

  const result = (hi << BigInt(64)) + lo;
  return result.toString();
};

const bufferToChain = (value: any) => {
  const string = Buffer.from(value).toString();
  return string;
};
