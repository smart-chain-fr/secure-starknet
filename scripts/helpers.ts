import { outputFile } from "fs-extra";
// import TransportNodeHid from "@ledgerhq/hw-transport-node-hid";
// import Stark from "@ledgerhq/hw-app-starknet";

export const saveContractAddress = (name: string, address: string) =>
    outputFile(
        `${process.cwd()}/../deployments/${name}.ts`,
        `export default "${address}";`
    );

// export const getSigner = async (adminSk?: string) => {
//     const useLedger = Number(process.env.USE_LEDGER);
//     const signer = useLedger
//         ? new Stark(await TransportNodeHid.create())
//         : await InMemorySigner.fromSecretKey(adminSk);
//     return signer;
// };