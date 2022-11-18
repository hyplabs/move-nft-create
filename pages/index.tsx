import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useState } from 'react';
import Navbar from '../components/Navbar';
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const [address, setAddress] = useState<string | null>(null);

  return (
    <div className={styles.container}>
      <Head>
        <title>Move NFT Create</title>
        <meta name="description" content="Move NFT Create" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar setAddress={setAddress} address={address}/>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Move NFT Create
        </h1>
        <div className='mt-20'>
          <button
            style={{ backgroundColor: 'black', color: 'white', paddingBlock: '13px', paddingInline: '20px', borderRadius: 5,  fontWeight: 500 }}
            onClick={(e) => {
              router.push('/create');
            }}
          >
            Create a Collection
          </button>
        </div>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://hypotenuse.ca/"
          target="_blank"
          rel="noopener noreferrer"
        >
          @ Hypotenuse Labs
          <span className={styles.logo}>
            <Image src="/favicon.ico" alt="Hype Logo" width={19} height={19} />
          </span>
        </a>
      </footer>

    </div>
  )
}
