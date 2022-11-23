import Link from "next/link";
import React, { useRef, useEffect, useState } from "react";
import { Nullable } from '../../utils/types';
import { trimAddress, getAptosWallet, connectWallet, disconnectWallet } from "../../utils/helper";
import { AptosAccount } from "aptos";

export type NavbarProps = {
  setAddress: (address: Nullable<string>) => void;
  setAccount: (account: Nullable<AptosAccount>) => void;
  address: Nullable<string>;
};

const Navbar: React.FC<NavbarProps> = ({ setAddress, setAccount, address }) => {
  // Retrieve aptos.account on initial render and store it.
  const isConnected = !!address;
  const [showConnectDropdown, setShowConnectDropdown] = React.useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if ('aptos' in window) {
      (async () => {
        const wallet = getAptosWallet();
        if (await wallet.isConnected()) {
          const account = await wallet.account();
          setAddress(account.address);
        }
      })();
    }
  }, []);

  // useEffect(() => {
  //   // only add the event listener when the dropdown is opened
  //   if (!showConnectDropdown) return;
  //   function handleClick(event: MouseEvent | TouchEvent) {
  //     console.log('dropdownRef.current',dropdownRef.current)
  //     console.log('event.target',event.target)
  //     console.log( dropdownRef.current !== event.target)
  //     console.log('showConnectDropdown',showConnectDropdown)
  //     if (dropdownRef && dropdownRef.current && dropdownRef.current !== event.target) {
  //       setShowConnectDropdown(false);
  //     }
  //   }
  //   window.addEventListener("click", handleClick);
  //   // clean up
  //   return () => {
  //     console.log('hit!!!')
  //     window.removeEventListener("click", handleClick)
  //   };
  // }, [showConnectDropdown]);

  return (
    <header className="bg-white px-10 border-b-2">
      <nav className={`nav`}>
        <Link href={"/"}>
          <h1 className="logo">Move NFT Create</h1>
        </Link>
        <div className={`nav__menu-list`}>
          <div>
            <div>
              <button
                className="bg-black hover:bg-gray-800 text-white font-medium py-2.5 rounded w-[156px]"
                onClick={(e) => {
                  connectWallet(setAddress, setAccount);
                  if (isConnected) setShowConnectDropdown(!showConnectDropdown);
                }}
              >
                {address ? (
                  <div>
                    <span style={{ color: '#2AC300', fontSize: '30px', lineHeight: '24px', verticalAlign:'sub'}}>•{' '}</span><span>{trimAddress(address)}</span>
                  </div>
                ) : (
                  <span>Connect Wallet</span>
                )}
              </button>
            </div>
            {showConnectDropdown && (
              <div>
                <button
                  ref={dropdownRef}
                  className="bg-white hover:bg-gray-100 text-black font-medium py-2.5 rounded w-[156px] absolute"
                  style={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.05), 0 6px 10px 0 rgba(0, 0, 0, 0.19)' }}
                  onClick={(e) => {
                    (async () => {
                      await disconnectWallet();
                      setAddress(null);
                      setAccount(null);
                      setShowConnectDropdown(false);
                    })();
                  }}
                >Disconnect</button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
