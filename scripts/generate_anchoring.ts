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


const get_anchoring_admin = async () => {
    const args = process.argv.slice(2);
    const address = args[0];
    return address !== undefined
      ? address
      : accountAddress;
};

// Get the factory address from argument, fallback to saved address
const factory = async () => {
    const env_factory = process.env.FACTORY_CONTRACT_ADDRESS;
    return (env_factory !== undefined) && (env_factory !== "")
      ? env_factory
      : (await import("../deployments/factory")).default;
};

const generate = async () => {
    try {
        const FACTORY_ADDRESS = await factory();
        const ANCHORING_ADMIN = await get_anchoring_admin();

        // read abi of Test contract
        const { abi: factoryAbi } = await provider.getClassAt(FACTORY_ADDRESS);
        if (factoryAbi === undefined) { throw new Error("no abi.") };
        const factoryContract = new Contract(factoryAbi, FACTORY_ADDRESS, provider);

        // Connect account with the contract
        factoryContract.connect(account);

        // Deploy a new Anchoring contract
        const myCall = factoryContract.populate("deploy", [ANCHORING_ADMIN]);
        const deployCallResponse = await factoryContract.deploy(myCall.calldata);
        console.log('Waiting for Factory::deploy invocation', deployCallResponse.transaction_hash);
        await provider.waitForTransaction(deployCallResponse.transaction_hash);
        console.log("✅ Anchoring contract generated.", deployCallResponse);
        
        // Retrieve the address of the new contract from the storage
        let owner_contract_index = await factoryContract.call("get_owner_contract_index", [ANCHORING_ADMIN]);
        let index = Number(owner_contract_index);
        if (index > 0) {
            let last_contract_index = index - 1;
            let anchoring_contract = await factoryContract.call("get_contract_by_owner_index", [ANCHORING_ADMIN, last_contract_index.toString(16)]);
            console.log(`anchoring_contract (hex) : 0x${anchoring_contract.toString(16)}`);
            saveContractAddress("anchoring", `0x${anchoring_contract.toString(16)}`);
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

generate();