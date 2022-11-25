import type { NextApiRequest, NextApiResponse } from 'next'
import {
  AptosClient,
  AptosAccount,
  HexString,
  TxnBuilderTypes,
  FaucetClient,
} from "aptos";
import * as fs from "fs";
import { NODE_URL, FAUCET_URL } from '../../utils/constants';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
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
    await faucetClient.fundAccount(moduleOwner.address(), 100_000_000);

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
    try {
      await client.waitForTransaction(txnHash, { checkSuccess: true });
      res.status(200).send({ status: 'OK' });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error });
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error });
  }
}
