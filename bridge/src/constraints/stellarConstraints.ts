import { envConfigs } from "../helpers/common/envConfigs";

class StellarConstraints {
  static horizonServer = `https://mainnet.stellar.validationcloud.io/v1/${envConfigs.validationCloudKey}`;
  // static horizonServer = "https://horizon.stellar.org";
  static sorobanServer = "https://soroban-rpc.mainnet.stellar.gateway.fm";
  // static sorobanServer = "https://soroban.stellar.org";
  static contractId =
    "CBTWKH2SZKZAT3AWASDL4GPMGLA4IVGO6ALNVAXERC57GWLQKVW426T7";
}

export default StellarConstraints;
