import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { connectWallet, trimAddress } from "../utils/helper";
import { useForm, Controller } from "react-hook-form";

export default function Create() {
  const { handleSubmit, register, formState: { errors } } = useForm();
  const [address, setAddress] = useState<string | null>(null);
  const isConnected = !!address;
  const prefix = '$';
  const placeholderImage = 'https://i.redd.it/ksujk7ou8bo41.png';

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

  const getAptosWallet = () => {
    if ("aptos" in window) {
      return window.aptos;
    } else {
      window.open("https://petra.app/", `_blank`);
    }
  };

  const onSubmit = (values: any) => {
    console.log(values);
    connectWallet(setAddress);
    if (isConnected) createCollection();
  };

  const createCollection = () => {

  }


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
        <div className="w-full md:w-1/2 mb-8 md:pr-16 font-medium pt-14">
          <img src={placeholderImage} className="border-2 rounded-xl mx-auto" />
          <h2 className='text-4xl mt-8'>Collection Name</h2>
          <div className='mt-2 mb-6 text-sm space-x-6'><span>$SYMBOL</span><span>EDITION OF 1000</span></div>
          <div className="flex flex-row space-x-6">
            <div><div className="text-sm">EDITION PRICE</div><div className="font-bold text-2xl">0.00 APTOS</div></div>
            <div><div className="text-sm">TOTAL SUPPLY</div><div className="font-bold text-2xl">1000</div></div>
          </div>
        </div>

        {/* Collection details form on right half of screen */}
        <div className="w-full md:w-1/2 md:pl-16 md:border-l-2 py-14">
          <h2 className='text-4xl mb-8'>Collection Details</h2>

          {/* Metadata form */}
          <form onSubmit={handleSubmit(onSubmit)} className='flex-col'>
            <div className={styles.input_title}>Name</div>
            <input placeholder="Hype Labs" {...register("name", { required: true })} className={styles.input} aria-invalid={errors.name ? "true" : "false"}/>
            {errors.name && <span className={styles.input_error}>This field is required</span>}
            
            <div className={styles.input_title}>Symbol</div>
            <input
              placeholder="HYPE"
              {...register("symbol", { required: true })}
              className={styles.input}
              aria-invalid={errors.symbol ? "true" : "false"}
              ref={(target)=>{if (target) target.value = prefix}}
              onChange={(e)=>{
                const input = e.target.value
                e.target.value = prefix + input.substring(prefix.length).toUpperCase()
              }}/>
            {errors.symbol && <span className={styles.input_error}>This field is required</span>}
            
            <div className={styles.input_title}>Description</div>
            <textarea placeholder="This is the description for this collection of NFTs." {...register("description", { required: true })} className={styles.input} aria-invalid={errors.description ? "true" : "false"} />
            {errors.description && <span className={styles.input_error}>This field is required</span>}
            
            <div className={styles.input_title}>Media</div>
            <input type="file" accept="image/*, videos/*" {...register("media", { required: true })} className={styles.input} aria-invalid={errors.media ? "true" : "false"} />
            {errors.media && <span className={styles.input_error}>This field is required</span>}
            
            <div className="flex flex-row space-x-3">
              <div className="w-48">
                <div className={styles.input_title}>Sale Type</div>
                  <div className={`${styles.dropdown}`}>
                    <select {...register("saleType")}>
                      <option value="fixed" className={styles.dropdown_option}>Fixed</option>
                      <option value="auction" className={styles.dropdown_option}>Auction</option>
                    </select>
                  </div>
                {errors.saleType && <span className={styles.input_error}>This field is required</span>}   
              </div>
              <div className="w-full">
                <div className={styles.input_title}>Price</div>
                <input type="number" placeholder="0.01" {...register("price", { required: true, valueAsNumber: true, validate: (value) => value > 0, })} className={styles.input} aria-invalid={errors.price ? "true" : "false"}/>
                {errors.price && <span className={styles.input_error}>This field is required</span>}   
              </div>
            </div>
            
            <div className={styles.input_title}>Editions</div>
            <input type="editions" readOnly={true} value={1000} {...register("editions", { required: true, valueAsNumber: true, validate: (value) => value > 0, })} className={styles.input} />
            <input type="submit" value={isConnected ? 'Create' : 'Connect Wallet'} className="bg-black hover:bg-gray-800 text-white font-medium py-2.5 rounded w-full mt-12" />
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
