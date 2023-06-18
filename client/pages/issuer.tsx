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
import { access } from "fs";


const GateTokenAbi = GateToken.abi;
let GateTokenAddress;
let SBTAddress;
const GateFactoryAbi = GateFactory.abi;
const GateFactoryAddress = "0x00d8b71ae03ca59911d455ef0cd27b216b4bcdcc";
const SBTAbi = SBT.abi;
const SBTFactoryAbi = SBTFactory.abi;
const SBTFactoryAddress = "0x72cb34bfc822904237184a6b71de32a990559425";




const Issuer: NextPage = () => {
  const [holderAddress, setHolderAddress] = useState("");
  const [gateName, setGateName] = useState("");
  const [gateSymbol, setGateSymbol] = useState("");
  const [cid, setCid] = useState("");
  const [encryptedSymmetricKey, setEncryptedSymmetricKey] = useState("");
  const [GateTokenAddress, setGateTokenAddress] = useState();
  const [SBTAddress, setSBTAddress] = useState("");


  const accessControlGateTokenConditions = [{
    contractAddress: GateTokenAddress,
    standardContractType: "ERC20",
    'chain': 'calibration',
    method: "balanceOf",
    parameters: [":userAddress"],
    returnValueTest: {
      comparator: ">",
      value: "0",
    }
  }]

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
    const encryptedObject = await Lit.encryptFile(blobFile, accessControlGateTokenConditions);
  
    console.log("encryptedObject: ", encryptedObject);
  }

  async function deployGate() {
    const provider = new ethers.BrowserProvider(window.ethereum)
    await provider.send("eth_accounts", []);
    const signer = await provider.getSigner();
    // create promise to deploy gate token with write function from useContractWrite hook and return data.address
    const deployGateContract = new ethers.Contract(GateFactoryAddress, GateFactoryAbi, signer);
    const deploymentTx = await deployGateContract.deployGate(holderAddress, gateName, gateSymbol);
    const receipt = await deploymentTx.wait(); // wait for tx to be mined

    let eventFilter = deployGateContract.filters.GateDeployed(holderAddress)
    // create promise for eventFilter
    let eventPromise = deployGateContract.queryFilter(eventFilter, receipt.blockNumber, receipt.blockNumber);
    // wait for eventPromise to resolve
    let eventResult = await eventPromise;
    console.log("events", eventFilter)
    console.log("eventResult: ", eventResult);

    console.log("address ", eventResult[0].args[0]);
    console.log("address ", eventResult[0].args[1]) // address of gate token );
    setGateTokenAddress(eventResult[0].args[1]);
  }

  async function deploySBT() {
    const provider = new ethers.BrowserProvider(window.ethereum)
    await provider.send("eth_accounts", []);
    const signer = await provider.getSigner();

    const deploySBTContract = new ethers.Contract(SBTFactoryAddress, SBTFactoryAbi, signer);
    const deploymentTx = await deploySBTContract.deploySBT("SBT", "SBT");

    const receipt = await deploymentTx.wait(); // wait for tx to be mined
    let eventFilter = deploySBTContract.filters.SBTDeployed(holderAddress) // create event filter;
    let eventPromise = deploySBTContract.queryFilter(eventFilter, receipt.blockNumber, receipt.blockNumber); // create promise for eventFilter
    let eventResult = await eventPromise; // wait for eventPromise to resolve
    console.log("eventResult: ", eventResult);
    console.log("address ", eventResult[0].args[0]);
    console.log("address ", eventResult[0].args[1]) // address of SBT token );
    setSBTAddress(eventResult[0].args[1]);
    console.log("SBT ADDRESS: ", SBTAddress);
  }

  async function mint() {
    const provider = new ethers.BrowserProvider(window.ethereum)
    await provider.send("eth_accounts", []);
    const signer = await provider.getSigner();

    console.log("SBT ADDRESS: ", SBTAddress);
    const SBT = new ethers.Contract(SBTAddress, SBTAbi, signer);
    const mintTx = await SBT.mint(holderAddress, 0, cid, encryptedSymmetricKey);
    const receipt = await mintTx.wait(); // wait for tx to be mined
    console.log("receipt: ", receipt);
  }

  async function issue() {
    await deployGate();
    await uploadFile(File);
    await deploySBT();
    await mint();
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
        </div>
        <div className={styles.card}>
          <input type="file" id="file" />
          <label htmlFor="file"> Choose a file</label>
          <br />
          <br />

          <p>Drag your file here or click in this area.</p>
        </div>
        <div className={styles.card}>
          <Button onClick={issue} variant="outlined">
            ISSUE SBT TO THE HOLDER
          </Button>
          <br />
          <br />
          <p>Gate token address: {GateTokenAddress}</p>
          <p>SBT address: {SBTAddress}</p>
          <p>cid: {cid}</p>
          <p>encryptedSymmetricKey: {encryptedSymmetricKey}</p>
        </div>
      </div>
    </main>
  );
};

export default Issuer;
