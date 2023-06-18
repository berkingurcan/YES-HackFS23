import * as React from "react";
import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { zeroETHaccessControlCondition } from "../utils/accessControls";
import Lit from "../utils/lit";
import { useContractWrite } from "wagmi";
import GateToken from "../../contracts/artifacts/contracts/GateToken.sol/GateToken.json";
import GateFactory from "../../contracts/artifacts/contracts/GateFactory.sol/GateFactory.json";
import SBT from "../../contracts/artifacts/contracts/SBT.sol/SBT.json";
import SBTFactory from "../../contracts/artifacts/contracts/SBTFactory.sol/SBTFactory.json";
import { ethers } from "ethers";



const GateTokenAbi = GateToken.abi;
let GateTokenAddress;
const GateFactoryAbi = GateFactory.abi;
const GateFactoryAddress = "0x00d8b71ae03ca59911d455ef0cd27b216b4bcdcc";
const SBTAbi = SBT.abi;
const SBTFactoryAbi = SBTFactory.abi;
const SBTFactoryAddress = "0x72cb34bfc822904237184a6b71de32a990559425";

function fileToBlob(file: File): Promise<Blob> {
  return new Promise<Blob>((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      const blob = new Blob([reader.result as ArrayBuffer], {
        type: file.type,
      });
      resolve(blob);
    };

    reader.onerror = () => {
      reject(new Error("Error reading file"));
    };

    reader.readAsArrayBuffer(new Blob([file]));
  });
}

// create function which encrypts pdf file and uploads to hyperspace via web3.storage
async function uploadFile(file: any) {
  let blobFile = await fileToBlob(file);
  await Lit.connect();
  const encryptedObject = await Lit.encryptFile(blobFile);

  console.log("encryptedObject: ", encryptedObject);
}


const Issuer: NextPage = () => {
  const [holderAddress, setHolderAddress] = useState("");
  const [gateName, setGateName] = useState("");
  const [gateSymbol, setGateSymbol] = useState("");
  const [cid, setCid] = useState("");
  const [encryptedSymmetricKey, setEncryptedSymmetricKey] = useState("");
  const [SBTAddress, setSBTAddress] = useState();
  const [GateTokenAddress, setGateTokenAddress] = useState();

  const { data: dataSBT, write: writeSBT } = useContractWrite({
    abi: SBTFactoryAbi,
    address: SBTFactoryAddress,
    functionName: "deploySBT",
    args: ["SBT", "SBT"],
  });

  const { data: mintSBT, write: writeMintSBT } = useContractWrite({
    abi: SBTAbi,
    address: SBTAddress,
    functionName: "mint",
    args: [holderAddress, 0, cid, encryptedSymmetricKey],
  });

  // create provider and signer
  


  async function deployGate() {
    const provider = new ethers.BrowserProvider(window.ethereum)
    await provider.send("eth_accounts", []);
    const signer = await provider.getSigner();
    // create promise to deploy gate token with write function from useContractWrite hook and return data.address
    const deployGateContract = new ethers.Contract(GateFactoryAddress, GateFactoryAbi, signer);
    const deploymentTx = await deployGateContract.deployGate(holderAddress, gateName, gateSymbol);
    const receipt = await deploymentTx.wait(); // wait for tx to be mined
    console.log("DEPLOYNMENT TX", deploymentTx)

    console.log("receipt: ", receipt);


    let eventFilter = deployGateContract.filters.GateDeployed(holderAddress)
    // create promise for eventFilter
    let eventPromise = deployGateContract.queryFilter(eventFilter, receipt.blockNumber, receipt.blockNumber);
    // wait for eventPromise to resolve
    let eventResult = await eventPromise;
    console.log("events", eventFilter)
    console.log("eventResult: ", eventResult);

    console.log("address ", eventResult[0].args[0]) // address of gate token );
    console.log("address ", eventResult[0].args[1]) // address of gate token );
    setGateTokenAddress(eventResult[0].args[1]);
  }

  async function deploySBT() {
    writeSBT();
  }

  async function mint() {
    writeMintSBT();
  }

  return (
    <main className={styles.main}>
      <h1>Issuer Page</h1>
      <ConnectButton />

      <div className={styles.container}>
        <div className={styles.card}>
          <h2>Deploy Gate Token for Holder</h2>
          <TextField
            id="outlined-basic"
            label="holder address"
            variant="outlined"
            onChange={(e) => setHolderAddress(e.target.value)}
          />
          <TextField
            id="outlined-basic"
            label="Gate Name"
            variant="outlined"
            onChange={(e) => setGateName(e.target.value)}
          />
          <TextField
            id="outlined-basic"
            label="Gate Symbol"
            variant="outlined"
            onChange={(e) => setGateSymbol(e.target.value)}
          />
          <br />
          <br />
          <Button variant="outlined" onClick={deployGate}>Deploy Gate Token</Button>
          <p>{GateTokenAddress}</p>
        </div>
        <div className={styles.card}>
          <input type="file" id="file" />
          <label htmlFor="file"> Choose a file</label>
          <br />
          <br />

          <p>Drag your file here or click in this area.</p>
        </div>
        <div className={styles.card}>
          <Button onClick={uploadFile} variant="outlined">
            ISSUE SBT TO THE HOLDER
          </Button>
          <br />
          <br />
        </div>
      </div>
    </main>
  );
};

export default Issuer;
