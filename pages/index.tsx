import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { Types, AptosClient } from "aptos";
import { useEffect, useState } from 'react';

// Create an AptosClient to interact with devnet.
const client = new AptosClient("https://fullnode.devnet.aptoslabs.com/v1");

declare global {
  interface Window { aptos: any; }
}

export default function Home() {
  // Retrieve aptos.account on initial render and store it.
  const urlAddress = global.window && window.location.pathname.slice(1);
  const [address, setAddress] = useState<string | null>(null);
  useEffect(() => {
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
  const [account, setAccount] = useState<Types.AccountData | null>(null);
  useEffect(() => {
    if (!address) return;
    client.getAccount(address).then(setAccount);
  }, [address]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Move NFT Create</title>
        <meta name="description" content="Move NFT Create" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Move NFT Create
        </h1>
        <p>
          <code>address: {address}</code>
        </p>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://hypotenuse.ca/"
          target="_blank"
          rel="noopener noreferrer"
        >
          @ Hypotenuse Labs
          <span className={styles.logo}>
            <Image src="/favicon.ico" alt="Hype Logo" width={16} height={16} />
          </span>
        </a>
      </footer>

    </div>
  )
}
