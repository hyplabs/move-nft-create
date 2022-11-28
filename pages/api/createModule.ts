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
        "0xab7036d176ed868bd75586b2470af9b18cccb21340489191c08e49627df54466",
      publicKeyHex:
        "0xbb458d309e9d465dba16cdd056fb7e3cbba661728a0a74641b64a922d4ff1398",
      privateKeyHex: `0x92c7fd75f5864c95ae199c6db84975bc5dad7cdb454070eed711e9059e79ddb9`,
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
