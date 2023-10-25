import { Provider, Contract, Account, ec, json, constants } from "starknet";
import * as dotenv from "dotenv";
import path from "path";
import fs from "fs";

// Read environment variables from .env file
dotenv.config({ path: path.join(__dirname, "..", ".env") });


console.log("connect wallet")

// initialize provider and account
const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } })
const privateKey = process.env.ACCOUNT_PRIVKEY;
const accountAddress = process.env.ACCOUNT_ADDRESS;
const account = new Account(provider, accountAddress, privateKey);

// Get the factory address from argument, fallback to saved address
const factory = async () => {
    const args = process.argv.slice(2);
    const address = args[0];
  
    return address !== undefined
      ? address
      : (await import("../deployments/factory")).default;
};

const get_admin = async () => {
    try {
        const FACTORY_ADDRESS = await factory();
        // read abi of Test contract
        const { abi: factoryAbi } = await provider.getClassAt(FACTORY_ADDRESS);
        if (factoryAbi === undefined) { throw new Error("no abi.") };
        const factoryContract = new Contract(factoryAbi, FACTORY_ADDRESS, provider);
        // console.log("factoryContract =", factoryContract); 
        // Connect account with the contract
        factoryContract.connect(account);

        // Get admin field of factory storage
        let adminResponse = await factoryContract.call("get_admin");
        console.log(`admin : 0x${adminResponse.toString(16)}`);
        
        let proposed_admin = await factoryContract.call("get_proposed_admin");
        console.log(`proposed_admin : 0x${proposed_admin.toString(16)}`);

        let owner_contract_index = await factoryContract.call("get_owner_contract_index", [accountAddress]);
        let index = Number(owner_contract_index);
        if (index > 0) {
            let last_contract_index = index - 1;
            let anchoring_contract = await factoryContract.call("get_owner_contract_by_index", [accountAddress, last_contract_index.toString(16)]);
            console.log(`anchoring_contract (hex) : 0x${anchoring_contract.toString(16)}`);
        }

    } catch (e) {
        // Aborted while using ledger
        if (e.statusText === "CONDITIONS_OF_USE_NOT_SATISFIED") {
            console.log("Aborted.");
        } else {
            console.log(e);
        }
    }
};

get_admin();