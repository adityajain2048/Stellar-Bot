import { config, types, web3 } from "../../helpers/common";
import { saveLockEvent } from "../../helpers";

export const evmListener = async () => {
  for (const network of config.evmChains) {
    try {
      //listen Lock events on common Bridge
      console.log(`Getting logs for ${network}`);
      const bridge = await web3.getBridgeInstance(network);
      const filter = bridge.filters[config.events.evm]?.();
      const alchemySDK = web3.getAlchemySDK(network);
      const emitter: any = alchemySDK ? alchemySDK.ws : bridge.provider;
      emitter.on(filter!, async (log: types.Log) => {
        console.log("logs: ", log);
        const parsedLog = bridge.interface.parseLog(log);
        await saveLockEvent(network, log, parsedLog, bridge);
      });
      for (const token of config.evmChainsInfo[network]!.supportedTokens) {
        //listen Lock events on token specific Bridge
        if (!token.bridge) continue;
        const tokenBridge: any = await web3.getBridgeInstance(
          network,
          token.bridge
        );
        const filter = tokenBridge.filters[config.events.evm]?.();
        tokenBridge.provider.on(filter!, async (log: types.Log) => {
          const parsedLog = tokenBridge.interface.parseLog(log);
          console.log("Parsed Log: ", parsedLog.args.destToken);
          await saveLockEvent(network, log, parsedLog, bridge);
        });
      }
    } catch (err: any) {
      console.log("Error while listening logs: ", err.message);
      console.log("Starting Listener");
      evmListener();
    }
  }
};
