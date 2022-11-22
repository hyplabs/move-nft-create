import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { connectWallet, getAptosWallet } from "../utils/helper";
import { useForm } from "react-hook-form";

enum SaleType {
  FIXED = 'fixed',
  AUCTION = 'auction',
}

type Collection = {
  name: string;
  symbol: string;
  description: string;
  media: File;
  saleType: SaleType;
  price: number;
  editions: number;
};

export default function Create() {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
  } = useForm();
  const [address, setAddress] = useState<string | null>(null);
  const isConnected = !!address;
  const SYMBOL_PREFIX = "$";
  const placeholderImage = "https://i.redd.it/ksujk7ou8bo41.png";

  useEffect(() => {
    if ("aptos" in window) {
      (async () => {
        const wallet = getAptosWallet();
        if (await wallet.isConnected()) {
          const account = await wallet.account();
          setAddress(account.address);
        }
      })();
    }
  }, []);

  const onSubmit = (values: any) => {
    console.log('yo');
    // connectWallet(setAddress);
    if (isConnected) createCollection(values as Collection);
  };

  const handleConnect=()=>{
    if (!isConnected) connectWallet(setAddress);
  }

  const createCollection = (values: Collection) => {
    console.log('creating collection...', values)
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Move NFT Create</title>
        <meta name="description" content="Move NFT Create" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar setAddress={setAddress} address={address} />
      <main className={styles.main_create}>
        {/* Collection preview on left half of screen */}
        <div className="w-full md:w-1/2 mb-8 md:pr-16 font-medium pt-14 space-y-4">
          <img src={placeholderImage} className="border-2 rounded-xl mx-auto" />
          <h2 className="text-4xl pt-6">Collection Name</h2>
          <div className="text-sm space-x-6">
            <span>$SYMBOL</span>
            <span>EDITION OF 1000</span>
          </div>
          <p className="text-sm space-x-6 font-normal">Description</p>
          <div className="flex flex-row space-x-6">
            <div>
              <div className="text-sm">EDITION PRICE</div>
              <div className="font-bold text-2xl">0.00 APTOS</div>
            </div>
            <div>
              <div className="text-sm">TOTAL SUPPLY</div>
              <div className="font-bold text-2xl">1000</div>
            </div>
          </div>
        </div>

        {/* Collection details form on right half of screen */}
        <div className="w-full md:w-1/2 md:pl-16 md:border-l-2 py-14">
          <h2 className="text-4xl mb-8">Collection Details</h2>

          {/* Metadata form */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex-col">
            {/* Collection Name */}
            <div className={styles.input_title}>Name</div>
            <input
              placeholder="Hype Labs"
              {...register("name", { required: true })}
              className={`${styles.input} ${errors.name && styles.invalid}`}
            />
            {errors.name && (
              <span className={styles.input_error}>This field is required</span>
            )}
            {/* NFT Symbol */}
            <div className={styles.input_title}>Symbol</div>
            <input
              placeholder="HYPE"
              {...register("symbol", { required: true,
                // pattern: {
                //   value: /\$[A-Za-z0-9]+/g,
                //   message: "Invalid symbol"
                // }
              })}
              className={`${styles.input} ${errors.symbol && styles.invalid}`}
              // ref={(target) => {
              //   console.log('sym', errors.symbol)
              //   console.log('um', target?.value)
              //   if (target && (target.value === undefined || target.value === '')) target.value = SYMBOL_PREFIX;
              // }}
              onChange={(e) => {
                const input = e.target.value;
                // if (!input.match('/\$[A-Za-z0-9]+/g')) {
                //   console.log('lol')
                //   setError('symbol', { type: 'custom', message: 'custom message' });
                //   return;
                // }
                // else {
                //   console.log('yo')
                // }
                // if (input.match('/\$[A-Za-z0-9]+/g')) {
                //   console.log('ALERT')
                // }
                e.target.value =
                  SYMBOL_PREFIX + input.substring(SYMBOL_PREFIX.length).toUpperCase();
              }}
            />
            {errors.symbol && (
              <span className={styles.input_error}>This field is required</span>
            )}
            {/* Collection Description */}
            <div className={styles.input_title}>Description</div>
            <textarea
              placeholder="This is the description for this collection of NFTs."
              {...register("description", { required: true })}
              className={`${styles.input} ${
                errors.description && styles.invalid
              }`}
            />
            {errors.description && (
              <span className={styles.input_error}>This field is required</span>
            )}
            {/* NFT Media Image/Video */}
            <div className={styles.input_title}>Media</div>
            <input
              type="file"
              accept="image/*, videos/*"
              {...register("media", { required: true })}
              className={`${styles.input} ${errors.media && styles.invalid}`}
            />
            {errors.media && (
              <span className={styles.input_error}>This field is required</span>
            )}
            {/* Sale Type dropdown (Fixed | Auction) */}
            <div className="flex flex-row space-x-3">
              <div className="w-48">
                <div className={styles.input_title}>Sale Type</div>
                <div className={`${styles.dropdown}`}>
                  <select {...register("saleType")}>
                    <option value={SaleType.FIXED} className={styles.dropdown_option}>
                      Fixed
                    </option>
                    <option value={SaleType.AUCTION} className={styles.dropdown_option}>
                      Auction
                    </option>
                  </select>
                </div>
                {errors.saleType && (
                  <span className={styles.input_error}>
                    This field is required
                  </span>
                )}
              </div>
              {/* NFT Price */}
              <div className="w-full">
                <div className={styles.input_title}>Price</div>
                <input
                  type="number"
                  placeholder="0.01"
                  {...register("price", {
                    required: true,
                    valueAsNumber: true,
                    validate: (value) => value && value > 0,
                  })}
                  className={`${styles.input} ${
                    errors.price && styles.invalid
                  }`}
                />
                {errors.price && (
                  <span className={styles.input_error}>
                    This field is required
                  </span>
                )}
              </div>
            </div>
            {/* Editions - fixed at 1000 */}
            <div className={styles.input_title}>Editions</div>
            <input
              type="editions"
              readOnly={true}
              value={1000}
              {...register("editions", {
                required: true,
                valueAsNumber: true,
                validate: (value) => value > 0,
              })}
              className={styles.input}
            />
            {/* Create Collection Button */}
            <input
              type="submit"
              value={isConnected ? "Create Collection" : "Connect Wallet"}
              className="bg-black hover:bg-gray-800 text-white font-medium py-2.5 rounded w-full mt-12"
              onClick={handleConnect}
            />
          </form>
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
  );
}
