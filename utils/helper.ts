import { AptosAccount } from "aptos";

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

export const connectWallet = async (setAddress: (address: string | null) => void, setAccount: (account: AptosAccount) => void) => {
  const wallet = getAptosWallet();
  try {
    const response = await wallet.connect(); // { address: string, publicKey: string }
    setAddress(response.address);

    const account: AptosAccount = await wallet.account(); // { address: string, publicKey: string }
    setAccount(account);
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
  // let newDate = new Date()
  // let date = newDate.getDate();
  // let month = newDate.getMonth() + 1;
  // let year = newDate.getFullYear();
  
  // return `${year}${separator}${month<10?`0${month}`:`${month}`}${separator}${date}`
  var now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0,16);
}
  