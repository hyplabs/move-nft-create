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
import { NODE_URL, CURRENT_NETWORK } from "../utils/constants";
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

  useEffect(() => {}, []);

  return (<>
  <Head>
        <title>Collections</title>
        <meta name="description" content="Move NFT Create" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    <Navbar/>

    <main>
        <h1 className={styles.title}>
        Collections
        </h1>
        <div className="grid place-items-center mt-10">Top collection ranked by floor price and and volumen</div>
        <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
      </main>
    
  </>);
}
