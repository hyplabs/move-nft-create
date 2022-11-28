import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useState, useEffect, useMemo } from "react";
import Navbar from "../components/Navbar";
import { connectWallet, getAptosWallet, getCurrentLocalDateTime, getFixedPriceSalePayload, getAuctionHousePayload, trimAddress } from "../utils/helper";
import { useForm } from "react-hook-form";
import { AptosClient } from "aptos";
import { Nullable, SaleType, Collection } from "../utils/types";
import placeholderImg from 'public/images/placeholder.png';
import { NODE_URL } from "../utils/constants";
import Modal from "react-modal";

export default function Create() {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm();
  Modal.setAppElement('*');
  const [address, setAddress] = useState<Nullable<string>>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>('Collection Name');
  const [symbol, setSymbol] = useState<string>('SYMBOL');
  const [description, setDescription] = useState<string>('Description');
  const [mediaUrl, setMediaUrl] = useState<string>(placeholderImg.src);
  const [saleType, setSaleType] = useState<SaleType>(SaleType.FIXED);
  const [price, setPrice] = useState<number>(0);
  const [editions, setEditions] = useState<number>(1000);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [txModalOpen, setTxModalOpen] = useState(false);
  const [txHash, setTxHash] = useState<string>('');

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
    setErrorMessage('');
    if (isConnected) createCollection(values as Collection);
    else connectWallet(setAddress);
  };

  const createCollection = async (collection: Collection) => {
    if (address === null) throw "Please connect your wallet";
    setIsLoading(true);

    // const response = await fetch("/api/createModule");
    // if (response.status !== 200) {
    //   setIsLoading(false);
    //   setErrorMessage("Error creating module");
    //   throw "Error creating module";
    // };
    setTxModalOpen(true);

    const client = new AptosClient(NODE_URL);
    const payload =
      collection.saleType === SaleType.FIXED
        ? getFixedPriceSalePayload(collection, address)
        : getAuctionHousePayload(collection, address);

    try {
      console.log('payload', payload);
      const pendingTransaction = await window.aptos.signAndSubmitTransaction(
        payload
      );
      console.log('pendingTransaction', pendingTransaction);
      const txn = await client.waitForTransactionWithResult(
        pendingTransaction.hash
      );
      console.log('txn', txn);

      
      setTxHash(txn.hash);
      setIsLoading(false);
      setErrorMessage('');
    } catch (error: any) {
      setTxModalOpen(false);
      setIsLoading(false);
      if (error && error.message) setErrorMessage(error.message);
      else throw error;
    }
  };

  const loadingIcon = (
    <div className="w-full flex" role="status">
      <svg className="mx-auto inline w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );

  const media = useMemo(() => {
    return (
      <div className={styles.placeholder_image} style={{
        height: 'fit-content',
        }}>
        {mediaUrl.includes(".mp4") ? (
          <video width="750" height="500" autoPlay muted controls key={mediaUrl} className="border-2 rounded-xl my-auto w-full">
            <source src={mediaUrl} type="video/mp4"/>
          </video>
        ) : (
          <img key={mediaUrl} src={mediaUrl || placeholderImg.src} className="border-2 rounded-xl my-auto w-full"/>
        )}
      </div>
    );
  }, [mediaUrl]);
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Move NFT Create</title>
        <meta name="description" content="Move NFT Create" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar
        setAddress={setAddress}
        address={address}
      />
      <main className={styles.main_create}>
        {/* Collection preview on left half of screen */}
        <div className="w-full lg:w-1/2 lg:pr-16 font-medium pt-14 space-y-5 md:border-r-2 md:min-h-[64rem]">
          {media}
          <h2 className="text-4xl pt-6">{name}</h2>
          <div className="flex text-md space-x-6">
            <div className="bg-black text-white py-1 px-2 rounded">${symbol}</div>
            <div className="my-auto">EDITION OF {editions}</div>
          </div>
          <p className="text-md font-normal text-gray-500 ">{description}</p>
          <div className="flex flex-row space-x-6 md:pb-16">
            <div>
              <div className="text-md">EDITION {saleType === SaleType.AUCTION && 'MIN '}PRICE</div>
              <div className="font-bold text-2xl">{price} APTOS</div>
            </div>
            <div>
              <div className="text-kf">TOTAL SUPPLY</div>
              <div className="font-bold text-2xl">{editions}</div>
            </div>
          </div>
        </div>

        {/* Collection details form on right half of screen */}
        <div className="w-full md:w-1/2 md:pl-16 py-14">
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
                })}
                className={`${styles.symbol_input} ${errors.symbol && styles.invalid}`}
                onChange={(e) => {
                  // Only accept alphanumeric characters as input for NFT $SYMBOL
                  const cleanText = e.target.value.replace(/[^0-9a-zA-Z]+/ig, "").toLocaleUpperCase();
                  setSymbol(cleanText);
                  setValue("symbol", cleanText);
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
                      pattern: {
                          value: /^((\d+(\.\d*)?)|(\.\d+))$/,
                          message: 'Please enter a number',
                      },
                    })}
                    className={styles.price}
                    onChange={(e) => setPrice(Number(e.target.value) || 0)}
                  />
                  <span className={styles.unit}>APTOS</span>
                </div>
                {errors.price && (
                  <span className={styles.input_error}>
                    {errors.price.type === 'required' ? 'This field is required' : errors.price.message?.toString()}
                  </span>
                )}
              </div>
            </div>
            {saleType === SaleType.AUCTION && (
              <div className="flex flex-row space-x-3">
                {/* Start Auction Date  - must be now (can only pass duration as param to the create AuctionHouse collection function) */}
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
            <div className={`${isLoading ? 'cursor-not-allowed':'hover:bg-gray-800'} bg-black text-white font-medium py-2.5 rounded w-full mt-12`}>
                {isLoading ? (
                  <div>{loadingIcon}</div>
                ) : (
                  <input
                    type="submit"
                    value={isConnected ? "Create Collection" : "Connect Wallet"}
                    className={`w-full hover:cursor-pointer`}
                    disabled={isLoading}
                  />
                )}
            </div>
            {errorMessage && (
              <span className={styles.input_error}>
                {errorMessage}
              </span>
            )}
          </form>
        </div>
      </main>
      <Modal
        className={styles.tx_modal}
        isOpen={txModalOpen}
        contentLabel="Transaction Modal"
        onRequestClose={() => setTxModalOpen(!txModalOpen)}
      >
        <div className="text-right align-text-top text-xl">
          <button
            className=""
            onClick={() => setTxModalOpen(!txModalOpen)}
          >
            ⨉
          </button>
        </div>
        <div className="text-center">
          <h1 className="text-2xl mt-[-23px]">Transaction Modal</h1>
          {isLoading ? (
            <div className="mt-12">
              {loadingIcon}
            </div>
          ) : (
            <div>
              <div className="my-6">
                Tx Hash:{` `}
                <a href={`https://explorer.aptoslabs.com/txn/${txHash}`} target="_blank" rel="noreferrer" className="text-blue-600">
                  {trimAddress(txHash)}
                </a>
              </div>
              <button
                className="bg-black hover:bg-gray-800 text-white font-medium py-2.5 rounded w-[156px]"
                onClick={() => setTxModalOpen(!txModalOpen)}
              >
                Close Modal
              </button>
            </div>
          )}
        </div>
      </Modal>
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
