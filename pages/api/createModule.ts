// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {
  AptosClient,
  AptosAccount,
  CoinClient,
  TokenClient,
  FaucetClient,
  HexString,
  TxnBuilderTypes,
  BCS,
} from "aptos";
import * as fs from "fs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    //////////////////////////////////////////////////////////
    const NODE_URL = "http://127.0.0.1:8080";
    const FAUCET_URL = "http://127.0.0.1:8081";
    // const NODE_URL: string = "https://fullnode.devnet.aptoslabs.com/v1/"
    // const FAUCET_URL = "https://faucet.devnet.aptoslabs.com"

    const alice = new AptosAccount();
    const client = new AptosClient(NODE_URL);

    let moduleOwner: AptosAccount;
    const moduleOwnerKeys = {
      address:
        "0x7f3d5a9cb25dcd7b3f9a73d266b96b62c13e0326abc0755c7f619ed2b908e98f",
      publicKeyHex:
        "0x12fcf065ffbea809331f69f03baf32c023b8630683e1533f71ca09e12e2c722f",
      privateKeyHex: `0x45bbfbcc3f1b3fc66c2c0a604e2f71462fc9c4825d4a83beab7a0609f1c4f4ab`,
    };
    moduleOwner = AptosAccount.fromAptosAccountObject(moduleOwnerKeys);

    const faucetClient = new FaucetClient(NODE_URL, FAUCET_URL);

    const initialFund = 100_000_000;
    await faucetClient.fundAccount(moduleOwner.address(), initialFund);
    await faucetClient.fundAccount(alice.address(), initialFund);

    // Publish module
    const packageMetadata = fs.readFileSync(
      "./build/marketplace/package-metadata.bcs"
    );
    const moduleData2 = fs.readFileSync(
      "./build/marketplace/bytecode_modules/FixedPriceSale.mv"
    );
    const moduleData1 = fs.readFileSync(
      "./build/marketplace/bytecode_modules/Auction.mv"
    );
    console.log("yooo");

    let txnHash = await client.publishPackage(
      moduleOwner,
      new HexString(packageMetadata.toString("hex")).toUint8Array(),
      [
        new TxnBuilderTypes.Module(
          new HexString(moduleData1.toString("hex")).toUint8Array()
        ),
        new TxnBuilderTypes.Module(
          new HexString(moduleData2.toString("hex")).toUint8Array()
        ),
      ]
    );
    console.log("published hash: ", txnHash);
    try {
      await client.waitForTransaction(txnHash, { checkSuccess: true });
    } catch (error) {
      console.log(error);
      throw error;
    }
    const modules = await client.getAccountModules(moduleOwner.address());
    const hasFixedPriceModule = modules.some(
      (m) => m.abi?.name === "FixedPriceSale"
    );
    const hasAuctionModule = modules.some((m) => m.abi?.name === "Auction");
    console.log('hasFixedPriceModule', hasFixedPriceModule)
    console.log('hasAuctionModule', hasAuctionModule)
    // expect(hasFixedPriceModule).toBe(true);
    // expect(hasAuctionModule).toBe(true);
    return res.status(200).end();
  } catch (e) {
    console.error(e);
    return res.status(400).json({ error: e });
  }
}
