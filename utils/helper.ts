import { Collection } from "./types";
import { APTOS_COIN_VALUE, MODULE_OWNER_ADDRESS } from "./constants";

export const trimAddress = (address: string) => {
  const prefix_address = "0x";
  try {
    const addressFirst = address.slice(0, 4 + prefix_address.length);
    const addressLast = address.slice(address.length - 4);
    return `${addressFirst}...${addressLast}`
  } catch (err) {
    return address
  }
}

export const getAptosWallet = () => {
  if ('aptos' in window) {
    return window.aptos;
  } else {
    window.open('https://petra.app/', `_blank`);
  }
};

export const connectWallet = async (setAddress: (address: string | null) => void) => {
  const wallet = getAptosWallet();
  try {
    const response = await wallet.connect(); // { address: string, publicKey: string }
    setAddress(response.address);
  } catch (error) {
    // { code: 4001, message: "User rejected the request."}
  }
};

export const disconnectWallet = async () => {
  const wallet = getAptosWallet();
  try {
    await wallet.disconnect();
  } catch (error) {
  }
}

export function getCurrentLocalDateTime(){
  var now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0,16);
}

export const getFixedPriceSalePayload = (collection: Collection, walletAddress: string) => {
  const data = [
    collection.name, // collection name
    collection.description, // collection description
    collection.media, // collection uri
    collection.editions ?? 1000, // collection maximum
    [false, false, false], // collection mutate settings
    collection.symbol, // token name
    collection.description, //token description
    collection.media, //token uri
    walletAddress, // royalty payee address
    100, // royalty points denominator
    0, // royalty points numerator - set to 0 for no royalties to be paid to royalty address
    [false, false, false, false, false], // token mutate setting
    [], // property keys
    [], // property values
    [], // property types
    collection.price * APTOS_COIN_VALUE, // listing price
    0, // expiration time (ms), if expirationTime is 0 -> sale will last forever
  ];
  const payload = {
    arguments: data,
    function: `${MODULE_OWNER_ADDRESS}::FixedPriceSale::create_collection_token_and_list`,
    type: "entry_function_payload",
    type_arguments: ["0x1::aptos_coin::AptosCoin"],
  };
  return payload;
};

export const getAuctionHousePayload = (collection: Collection, walletAddress: string) => {
  const now = new Date();
  const endDate = collection.endDate && Date.parse(collection.endDate ?? '') !== NaN ? new Date(collection.endDate): null;
  const expirationTime = endDate === null ? 0 : endDate.getTime() - now.getTime();
  const data = [
    collection.name, // collection name
    collection.description, // collection description
    collection.media, // collection uri
    collection.editions ?? 1000, // collection maximum
    [false, false, false], // collection mutate settings
    collection.symbol, // token name
    collection.description, //token description
    collection.media, //token uri
    walletAddress, // royalty payee address
    100, // royalty points denominator
    0, // royalty points numerator - set to 0 for no royalties to be paid to royalty address
    [false, false, false, false, false], // token mutate setting
    [], // property keys
    [], // property values
    [], // property types
    collection.price * APTOS_COIN_VALUE, // listing price
    expirationTime > 0 ? expirationTime : 0, // expiration time (ms), if expirationTime is 0 -> sale will last forever
  ];
  const payload = {
    arguments: data,
    function: `${MODULE_OWNER_ADDRESS}::Auction::create_collection_token_and_initialize_auction`,
    type: "entry_function_payload",
    type_arguments: ["0x1::aptos_coin::AptosCoin"],
  };
  return payload;
};
