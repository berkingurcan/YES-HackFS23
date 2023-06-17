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

  const { data, isLoading, isSuccess, write } = useContractWrite({
    abi: GateFactoryAbi,
    address: GateFactoryAddress,
    functionName: "deployGate",
    args: [holderAddress, gateName, gateSymbol],
  });

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

  async function deployGate() {
    write();
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
