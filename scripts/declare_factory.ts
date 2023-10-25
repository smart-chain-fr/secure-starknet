import { Provider, Contract, Account, ec, json, constants } from "starknet";
import * as dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { saveContractAddress } from "./helpers";

// Read environment variables from .env file
dotenv.config({ path: path.join(__dirname, "..", ".env") });


console.log("connect wallet")

// initialize provider
const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } })
// const provider = new Provider({ sequencer: { baseUrl:"http://127.0.0.1:5050"  } });

const privateKey = process.env.ACCOUNT_PRIVKEY;
const accountAddress = process.env.ACCOUNT_ADDRESS;

const account = new Account(provider, accountAddress, privateKey);

console.log(account)

const declare = async () => {
    try {
        // Declare Test contract in devnet
        const compiledContract = json.parse(fs.readFileSync("../target/dev/factory_anchor_Factory.sierra.json").toString("ascii"));
        const compiledContractCasm = json.parse(fs.readFileSync("../target/dev/factory_anchor_Factory.casm.json").toString("ascii"));
        const declareResponse = await account.declare({ contract: compiledContract, casm: compiledContractCasm });
        await provider.waitForTransaction(declareResponse.transaction_hash);

        console.log("✅ Contract declared.", declareResponse.class_hash);
        saveContractAddress("factory_class_hash", declareResponse.class_hash);
        // console.log(`[OK] : ${declareResponse}`);

    } catch (e) {
        // Aborted while using ledger
        if (e.statusText === "CONDITIONS_OF_USE_NOT_SATISFIED") {
            console.log("Aborted.");
        } else {
            console.log(e);
        }
    }
};

declare();