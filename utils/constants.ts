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

export const CURRENT_NETWORK = Network.LOCAL;
export const NETWORK_ID = getNetworkId(CURRENT_NETWORK);
export const APTOS_COIN_VALUE = 100_000_000;
export const MODULE_OWNER_ADDRESS =
  "0xdadf473807397f6e95415b8605846bc4ee4659e92b5297a05ad4e5a29ed7455d";
export const NODE_URL =
  CURRENT_NETWORK === Network.LOCAL
    ? "http://127.0.0.1:8080"
    : `https://fullnode.${CURRENT_NETWORK}.aptoslabs.com`;
export const FAUCET_URL =
  CURRENT_NETWORK === Network.LOCAL
    ? "http://127.0.0.1:8081"
    : `https://faucet.${CURRENT_NETWORK}.aptoslabs.com`;
