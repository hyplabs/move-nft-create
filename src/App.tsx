import React from "react";
import { Types, AptosClient } from "aptos";

// Create an AptosClient to interact with devnet.
const client = new AptosClient("https://fullnode.devnet.aptoslabs.com/v1");

function App() {
  // Retrieve aptos.account on initial render and store it.
  const urlAddress = global.window && window.location.pathname.slice(1);
  const [address, setAddress] = React.useState<string | null>(null);
  React.useEffect(() => {
    if (urlAddress) {
      setAddress(urlAddress);
    } else {
      window.aptos.connect();
      window.aptos
        .account()
        .then((data: { address: string }) => setAddress(data.address));
    }
  }, [urlAddress]);

  // Use the AptosClient to retrieve details about the account.
  const [account, setAccount] = React.useState<Types.AccountData | null>(null);
  React.useEffect(() => {
    if (!address) return;
    client.getAccount(address).then(setAccount);
  }, [address]);

  return (
    <div className="App">
      <p>
        address:<code>{address}</code>
      </p>
      <p>
        <code>{account?.sequence_number}</code>
      </p>
    </div>
  );
}

export default App;