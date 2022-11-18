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

    const account = await wallet.account(); // { address: string, publicKey: string }
  } catch (error) {
    // { code: 4001, message: "User rejected the request."}
  }
};

export const disconnectWallet = async (setAddress: (address: string | null) => void, ) => {
  const wallet = getAptosWallet();
  try {
    await wallet.disconnect();
    setAddress(null);
  } catch (error) {
  }
}
  