import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useState, useEffect, useMemo } from "react";
import Navbar from "../components/Navbar";
import { connectWallet, getAptosWallet, getCurrentLocalDateTime } from "../utils/helper";
import { useForm } from "react-hook-form";
import { AptosClient, AptosAccount } from "aptos";
import { Nullable, SaleType, Collection, TokenDataId, WithdrawCapability, TokenId } from "../utils/types";
import placeholderImg from 'public/images/placeholder.png';

const APTOS_COIN_VALUE = 100_000_000;

const MODULE_OWNER_ADDRESS =
  "0x7f3d5a9cb25dcd7b3f9a73d266b96b62c13e0326abc0755c7f619ed2b908e98f";

export default function Create() {
  const {
    handleSubmit,
    register,
    formState: { errors },
    getValues,
    setError,
  } = useForm();
  const [address, setAddress] = useState<Nullable<string>>(null);
  const [account, setAccount] = useState<Nullable<AptosAccount>>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>('Collection Name');
  const [symbol, setSymbol] = useState<string>('SYMBOL');
  const [description, setDescription] = useState<string>('Description');
  const [mediaUrl, setMediaUrl] = useState<string>(placeholderImg.src);
  const [saleType, setSaleType] = useState<SaleType>(SaleType.FIXED);
  const [price, setPrice] = useState<number>(0);
  const [editions, setEditions] = useState<number>(1000);

  let isConnected = !!address;

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
    console.log("onSubmit");
    // connectWallet(setAddress);
    if (isConnected) createCollection(values as Collection);
  };

  const handleConnect = async () => {
    console.log('handleConnect')
    if (!address) await connectWallet(setAddress, setAccount);
    const collectionValues = getValues() as Collection;
    createCollection(collectionValues);
  };

  const createCollection = async (collection: Collection) => {
    console.log("creating collection...", collection);

    if (account === null) {
      console.log("connectWallet!");
      await connectWallet(setAddress, setAccount);
    }

    if (account === null || address === null) return;

    setIsLoading(true);

    const response = await fetch("/api/createModule");
    if (response.status !== 200) {
      setIsLoading(false);
      throw "Error creating module";
    };

    const NODE_URL = "http://127.0.0.1:8080";
    // const NODE_URL: string = "https://fullnode.devnet.aptoslabs.com/v1/"

    const client = new AptosClient(NODE_URL);
    const payload =
      collection.saleType === SaleType.FIXED
        ? getFixedPriceSalePayload(collection)
        : getAuctionHousePayload(collection);

    try {
      const pendingTransaction = await window.aptos.signAndSubmitTransaction(
        payload
      );
      const txn = await client.waitForTransactionWithResult(
        pendingTransaction.hash
      );
      setIsLoading(false);
      console.log("3 txn", txn);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const getFixedPriceSalePayload = (collection: Collection) => {
    const data = [
      collection.name, // collection name
      collection.description, // collection description
      "https://xyz.com", // collection uri
      collection.editions ?? 1000, // collection maximum
      [false, false, false], // collection mutate settings
      collection.symbol, // token name
      collection.description, //token description
      "https://xyz.com", //token uri
      address, // royalty payee address
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

  const getAuctionHousePayload = (collection: Collection) => {
    const now = new Date();
    const endDate = collection.endDate && Date.parse(collection.endDate ?? '') !== NaN ? new Date(collection.endDate): null;
    const expirationTime = endDate === null ? 0 : endDate.getTime() - now.getTime();
    const data = [
      collection.name, // collection name
      collection.description, // collection description
      "https://xyz.com", // collection uri
      collection.editions ?? 1000, // collection maximum
      [false, false, false], // collection mutate settings
      collection.symbol, // token name
      collection.description, //token description
      "https://xyz.com", //token uri
      address, // royalty payee address
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
      function: `${MODULE_OWNER_ADDRESS}::FixedPriceSale::create_collection_token_and_initialize_auction`,
      type: "entry_function_payload",
      type_arguments: ["0x1::aptos_coin::AptosCoin"],
    };
    return payload;
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Move NFT Create</title>
        <meta name="description" content="Move NFT Create" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar
        setAddress={setAddress}
        setAccount={setAccount}
        address={address}
      />
      <main className={styles.main_create}>
        {/* Collection preview on left half of screen */}
        <div className="w-full lg:w-1/2 mb-8 lg:pr-16 font-medium pt-14 space-y-5">
          <div className={styles.placeholder_image} style={{ aspectRatio: 1/1 }}>
            <img src={mediaUrl || placeholderImg.src} className="border-2 rounded-xl my-auto w-full"/>
          </div>
          <h2 className="text-4xl pt-6">{name}</h2>
          <div className="text-sm space-x-6 flex">
            <div className="bg-black text-white py-1 px-2 rounded">${symbol}</div>
            <div className="my-auto">EDITION OF {editions}</div>
          </div>
          <p className="text-sm space-x-6 font-normal text-gray-500 ">{description}</p>
          <div className="flex flex-row space-x-6 flex">
            <div>
              <div className="text-sm">EDITION {saleType === SaleType.AUCTION && 'MIN '}PRICE</div>
              <div className="font-bold text-2xl">{price} APTOS</div>
            </div>
            <div>
              <div className="text-sm">TOTAL SUPPLY</div>
              <div className="font-bold text-2xl">{editions}</div>
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
              onChange={(e) => setName(e.target.value || "Collection Name")}
            />
            {errors.name && (
              <span className={styles.input_error}>This field is required</span>
            )}
            {/* NFT Symbol */}
            <div className={styles.input_title}>Symbol</div>
            <div className={styles.input_container}>
              <span className={styles.symbol_prefix}>$</span>
              <input
                placeholder="HYPE"
                {...register("symbol", {
                  required: true,
                  pattern: {
                    value: /\$[A-Za-z0-9]+/g,
                    message: "Invalid symbol"
                  }
                })}
                className={`${styles.symbol_input} ${errors.symbol && styles.invalid}`}
                onChange={(e) => {
                  const input = e.target.value.toLocaleUpperCase();
                  const re = /\$[A-Za-z0-9]+/g;
                  const regex = new RegExp(/\$[A-Za-z0-9]+/g);
                  const cleanText = input.replace(regex, "");
                  const newText = re[Symbol.replace](input, "");
                  console.log('cleanText', newText)
                  e.target.value = input.replace(/[^0-9A-Z]+/ig, "")
                }}
              />
            </div>
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
              onChange={(e) => setDescription(e.target.value || "Description")}
            />
            {errors.description && (
              <span className={styles.input_error}>This field is required</span>
            )}
            {/* NFT Media Image/Video */}
            <div className={styles.input_title}>Media URL</div>
            {/* <input
              type="file"
              accept="image/*, videos/*"
              {...register("media", { required: true })}
              className={`${styles.input} ${errors.media && styles.invalid}`}
            /> */}
            <input
              type="text"
              placeholder="https://example.png"
              {...register("media", { required: true })}
              className={`${styles.input} ${errors.media && styles.invalid}`}
              onChange={(e) => setMediaUrl(e.target.value || placeholderImg.src)}
            />
            {errors.media && (
              <span className={styles.input_error}>This field is required</span>
            )}
            {/* Sale Type dropdown (Fixed | Auction) */}
            <div className="flex flex-row space-x-3">
              <div className="w-48">
                <div className={styles.input_title}>Sale Type</div>
                <div className={`${styles.dropdown}`}>
                  <select {...register("saleType")} onChange={(e) => setSaleType(e.target.value === SaleType.FIXED ? SaleType.FIXED : SaleType.AUCTION)}>
                    <option
                      value={SaleType.FIXED}
                      className={styles.dropdown_option}
                    >
                      Fixed
                    </option>
                    <option
                      value={SaleType.AUCTION}
                      className={styles.dropdown_option}
                    >
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
                <div className={styles.input_title}>{saleType === SaleType.FIXED ? 'Price' : 'Min Price'}</div>
                <div className={`${styles.input_container} ${errors.price && styles.invalid}`}>
                  <input
                    placeholder="0.01"
                    {...register("price", {
                      required: true,
                      pattern: /^((\d+(\.\d*)?)|(\.\d+))$/,
                      validate: (value) => value && value > 0,
                    })}
                    className={styles.price}
                    onChange={(e) => setPrice(Number(e.target.value) || 0)}
                  />
                  <span className={styles.unit}>APTOS</span>
                </div>
                {errors.price && (
                  <span className={styles.input_error}>
                    This field is required
                  </span>
                )}
              </div>
            </div>
            {saleType === SaleType.AUCTION && (
              <div className="flex flex-row space-x-3">
                {/* Start Auction Date  - must be now (can only pass duration to create auction collection) */}
                <div className="w-full mt-auto">
                  <div className={styles.input_title}>Start Date</div>
                  <input className={styles.input_disabled} type="text" placeholder='Now' disabled />
                </div>
                <div className="mt-auto mb-2">
                  →
                </div>
                {/* End time */}
                <div className="w-full mt-auto">
                  <div className={styles.input_title}>End Date <span className="text-gray-400 text-sm">&nbsp;Optional</span></div>
                  <input
                    className={styles.input}
                    type="datetime-local"
                    {...register("endDate", {
                      valueAsDate: true,
                    })}
                    min={getCurrentLocalDateTime()}
                    placeholder="Forever"
                  />
                  {errors.end_date && (
                    <span className={styles.input_error}>
                      Invalid date entered
                    </span>
                  )}
                </div>
              </div>
            )}
            {/* Editions - fixed at 1000 */}
            <div className={styles.input_title}>Editions</div>
            <input
              type="number"
              placeholder="1000"
              {...register("editions", {
                valueAsNumber: true,
                validate: (value) => value && value > 0,
              })}
              className={styles.input}
              onChange={(e) => {
                setEditions(Number(e.target.value) || 1000)}
              }
            />
            {/* Create Collection Button */}
            <input
              type="submit"
              value={isLoading ? 'Loading...' : isConnected ? "Create Collection" : "Connect Wallet"}
              className={`${isLoading ? 'bg-gray-500':'bg-black hover:bg-gray-800'} text-white font-medium py-2.5 rounded w-full mt-12 ${isLoading && 'cursor-not-allowed'}`}
              onClick={handleConnect}
              disabled={isLoading}
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
