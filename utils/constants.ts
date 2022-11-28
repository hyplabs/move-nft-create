enum Network {
  LOCAL = "local",
  DEVNET = "devnet",
  TESTNET = "testnet",
  MAINNET = "mainnet",
}

const getNetworkId = (network: Network) => {
  switch (network) {
    case Network.LOCAL: return "4";
    case Network.DEVNET: return "38";
    case Network.TESTNET: return "2";
    case Network.MAINNET:
    default: return "1";
  }
}

export const CURRENT_NETWORK = Network.DEVNET;
export const NETWORK_ID = getNetworkId(CURRENT_NETWORK);
export const APTOS_COIN_VALUE = 100_000_000;
export const MODULE_OWNER_ADDRESS =
  "0xb027632b7d00f81353d5380edfeb7b636c65c1fd653e2bb01628c06d6dbe1b6c";
export const NODE_URL =
  (CURRENT_NETWORK as Network) === Network.LOCAL
    ? "http://127.0.0.1:8080"
    : `https://fullnode.${CURRENT_NETWORK}.aptoslabs.com`;
export const FAUCET_URL =
  (CURRENT_NETWORK as Network) === Network.LOCAL
    ? "http://127.0.0.1:8081"
    : `https://faucet.${CURRENT_NETWORK}.aptoslabs.com`;
