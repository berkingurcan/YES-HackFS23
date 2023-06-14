import * as React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { zeroETHaccessControlCondition } from "../utils/accessControls";
import Lit from  "../utils/lit";

function fileToBlob(file: File): Promise<Blob> {
    return new Promise<Blob>((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onloadend = () => {
        const blob = new Blob([reader.result as ArrayBuffer], { type: file.type });
        resolve(blob);
      };
  
      reader.onerror = () => {
        reject(new Error('Error reading file'));
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
    return (
    <main className={styles.main}>
      <h1>Issuer Page</h1>
      <ConnectButton />

      <div className={styles.container}>
        <div className={styles.card}>
          <input type="file" id="file" />
          <label htmlFor="file"> Choose a file</label>
          <br />
          <br />

          <p>Drag your file here or click in this area.</p>
        </div>
        <div className={styles.card}>
          <Button onClick={uploadFile} variant="outlined">Upload File To Filecoin</Button>
          <br />
          <br />

          <TextField
            id="outlined-basic"
            label="holder address"
            variant="outlined"
          />
          <br />
          <br />

          <Button variant="outlined">Mint SBT</Button>
        </div>
        <div className={styles.card}>
          <h2>Deploy Gate Token for Holder</h2>
          <TextField
            id="outlined-basic"
            label="holder address"
            variant="outlined"
          />
          <br />
          <br />
          <Button variant="outlined">Deploy Gate Token</Button>
        </div>
      </div>
    </main>
  );
};

export default Issuer;
