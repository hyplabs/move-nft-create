import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import NavItem from "../NavItem";

export type NavbarProps = {
  setAddress: (address: string) => void;
};


const MENU_LIST = [
  { text: "Home", href: "/" },
  { text: "About Us", href: "/about" },
  { text: "Contact", href: "/contact" },
];

const Navbar: React.FC<NavbarProps> = ({ setAddress }) => {
  // Retrieve aptos.account on initial render and store it.
  const urlAddress = global.window && window.location.pathname.slice(1);
  const [navActive, setNavActive] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);

  // console.log('urlAddres', urlAddress)

  // useEffect(() => {
  //   if (urlAddress) {
  //     setAddress(urlAddress);
  //   } else {
  //     window.aptos.connect();
  //     window.aptos
  //       .account()
  //       .then((data: { address: string }) => setAddress(data.address));
  //   }
  // }, [urlAddress]);

  const connectWallet = async () => {
    if (urlAddress) {
      setAddress(urlAddress);
    } else {
      await window.aptos.connect();
      window.aptos
        .account()
        .then((data: { address: string }) => {
          setAddress(data.address);
        });
      console.log('three')
    }
  };

  return (
    <header>
      <nav className={`nav`}>
        <Link href={"/"}>
          {/* <a> */}
          <h1 className="logo">Move NFT Create</h1>
          {/* </a> */}
        </Link>
        {/* <div
          onClick={() => setNavActive(!navActive)}
          className={`nav__menu-bar`}
        >
          <div></div>
          <div></div>
          <div></div>
        </div> */}
        <div className={`${navActive ? "active" : ""} nav__menu-list`}>
          {/* {MENU_LIST.map((menu, idx) => (
            <div
              onClick={() => {
                setActiveIdx(idx);
                setNavActive(false);
              }}
              key={menu.text}
            >
              <NavItem active={activeIdx === idx} {...menu} />
            </div>
          ))} */}
          <button
            style={{ backgroundColor: 'black', color: 'white', paddingInline: '15px', paddingBlock: '10px', borderRadius: 5,  fontWeight: 500 }}
            className="bg-black hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={(e) => {
              connectWallet();
              setActiveIdx(0);
              setNavActive(false);
            }}
          >
            Connect Wallet
            {/* <NavItem active={activeIdx === 0} {...{ text: "Connect Wallet", href: "/contact" }} /> */}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
