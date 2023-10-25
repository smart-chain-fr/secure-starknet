import { Provider, Contract, Account, ec, json, constants } from "starknet";
import * as dotenv from "dotenv";
import path from "path";
import fs from "fs";

// Read environment variables from .env file
dotenv.config({ path: path.join(__dirname, "..", ".env") });

// initialize provider and account
// const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } });
const provider = new Provider({ rpc: { nodeUrl: "https://json-rpc.starknet-testnet.public.lavanet.xyz/"  } });
const privateKey = process.env.ACCOUNT_PRIVKEY;
const accountAddress = process.env.ACCOUNT_ADDRESS;

// const pub = ec.starkCurve.getPublicKey(privateKey, false);
// // const accountAddress = buf2hex(pub).slice(2, 64);
// const accountAddress = ec.starkCurve.keccak(pub).toString();
// console.log("accountAddress", `0x${accountAddress}`);
const account = new Account(provider, accountAddress, privateKey);

// Get the factory address from argument, fallback to saved address
const parse_args = async () => {
    const args = process.argv.slice(2);
    console.log("process.argv", process.argv);
    if ( args.length === 2) {
        const msg = args[0];
        const anchor_contract = args[1];
        return [anchor_contract, msg];
    } else if ( args.length === 1) {
        const msg = args[0];
        const anchor_contract = (await import("../deployments/anchoring")).default
        return [anchor_contract, msg];
    } else {
        throw new Error("Invalid number of arguments.");
    }
};

const anchor_message = async () => {
    try {
        const [ANCHORING_ADDRESS, message] = await parse_args();

        // read abi of Test contract
        const { abi: anchoringAbi } = await provider.getClassAt(ANCHORING_ADDRESS);
        if (anchoringAbi === undefined) { throw new Error("no abi.") };
        const anchoringContract = new Contract(anchoringAbi, ANCHORING_ADDRESS, provider);
        // console.log("factoryContract =", factoryContract); 
        // Connect account with the contract
        anchoringContract.connect(account);

        // Anchor a message
        console.log("Attempt to anchor message:", message);
        let message_hexa = Buffer.from(message, 'utf8').toString('hex');
        let param = `0x${message_hexa}`;
        const myCall = anchoringContract.populate("anchor", [param]);
        console.log('Prepare argument for anchor invocation', myCall.calldata);
        const anchorCallResponse = await anchoringContract['anchor'](myCall.calldata);
        // const anchorCallResponse = await anchoringContract.anchor(myCall.calldata);
        console.log('Waiting for Anchoring::anchor invocation', anchorCallResponse.transaction_hash);
        await provider.waitForTransaction(anchorCallResponse.transaction_hash);
        console.log("✅ Anchor message.", anchorCallResponse);

        // Get timestamp of the anchored message
        let anchoredTimestampResponse = await anchoringContract.call("get_anchored_timestamp", [param]);
        // console.log(`anchoredTimestampResponse : ${anchoredTimestampResponse}`);
        let dateFormat = new Date(1970, 0, 1);
        dateFormat.setSeconds(Number(anchoredTimestampResponse));
        console.log(`message \"${message}\" anchored at ${dateFormat} (${anchoredTimestampResponse})`);

    } catch (e) {
        // Aborted while using ledger
        if (e.statusText === "CONDITIONS_OF_USE_NOT_SATISFIED") {
            console.log("Aborted.");
        } else {
            console.log(e);
        }
    }
};

anchor_message();