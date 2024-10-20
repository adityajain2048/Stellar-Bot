import * as utils from ".";
import * as types from "../types";

export const sanitizeTelegramText = (text: string): string => {
  return text
    .replace(`./g`, "\\.")
    .replace(`_`, "\\_")
    .replace(`|`, "\\|")
    .replace(`-/g`, "\\-")
    .replace(`#/g`, "\\#")
    .replace(`>/g`, "\\>");
  // .replaceAll(`.`, `\\.`)
  // .replaceAll(`_`, `\\_`)
  // .replace(`|`, `\\|`)
  // .replaceAll(`-`, `\\-`)
  // .replaceAll(`#`, `\\#`)
  // .replaceAll(`>`, `\\>`);
};

export const getExplorerTxUrl = (
  hash: string,
  network: types.supportedChains,
): string => {
  const config = utils.getConfig(network);
  let url = config!.explorerUrl.replace(/\/$/, "") + `/`;
  // if (network !== `tezos`) url = url + `tx/`;
  return url + hash;
};

export const getExplorerAddressUrl = (
  address: string,
  network: types.supportedChains,
): string => {
  const config = utils.getConfig(network);
  let url = config!.explorerUrl.replace(/\/$/, "") + `/`;
  // if (network !== `tezos`) url = url + `address/`;
  return url + address;
};
