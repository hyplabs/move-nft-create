import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";
// import Logo from "./Logo";
import NavItem from "./NavItem";

// const MENU_LIST = [
//   { text: "Home", href: "/" },
//   { text: "About Us", href: "/about" },
//   { text: "Contact", href: "/contact" },
// ];

export type NavbarProps = {
  setAddress: (address: string) => void;
};

const Navbar: React.FC<NavbarProps> = ({ setAddress }) => {
  // Retrieve aptos.account on initial render and store it.
  const urlAddress = global.window && window.location.pathname.slice(1);
  const [navActive, setNavActive] = useState(null);
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

  const connectWallet = () => {
    if (urlAddress) {
      setAddress(urlAddress);
    } else {
      window.aptos.connect();
      window.aptos
        .account()
        .then((data: { address: string }) => setAddress(data.address));
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
        <div
          onClick={() => setNavActive(!navActive)}
          className={`nav__menu-bar`}
        >
          <div></div>
          <div></div>
          <div></div>
        </div>
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
            className="bg-black hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            // className={`w-full h-full space-x-4 flex justify-center items-center rounded-full cursor-pointer bg-black`}
            onClick={(e) => {
              connectWallet();
              // onClick(e);
              // stopPropagation && e.stopPropagation();
            }}
          >
            Connect Wallet
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
