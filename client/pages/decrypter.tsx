import * as React from "react";
import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import type { NextPage } from "next";
import { ethers } from "ethers";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import SBT from "../../contracts/artifacts/contracts/SBT.sol/SBT.json";
import Lit from "../utils/lit";

const SBTAbi = SBT.abi;

const Decrypter: NextPage = () => {

    const [SBTAddress, setSBTAddress] = useState("");
    const [fileAddress, setFileAddress] = useState("");

    async function getSBTMetadata(address: string) {
        const provider = new ethers.BrowserProvider(window.ethereum)
        await provider.send("eth_accounts", []);
        const signer = await provider.getSigner();

        console.log("Getting metadata for SBT");
        const SBTContract = new ethers.Contract(address, SBTAbi, signer);
        const metadata = await SBTContract.getMetadata(0);

        console.log(metadata[0]);
        var objectParam = '[object Object]'; // Replace this with your desired value

        // Convert the objectParam to a string and handle any special characters
        var encodedParam = encodeURIComponent(objectParam);

        const encryptedData = "https://" + metadata[0] + ".ipfs.w3s.link/" + `${encodedParam}`;
        setFileAddress(encryptedData);
        console.log(encryptedData)
        return metadata[0];
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Decrypter</title>
                <meta name="description" content="Decrypter" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h1>Decrypter</h1>
                <p className={styles.description}>
                    Decrypter
                </p>
                <ConnectButton />

                <div className={styles.container}>
                    <div className={styles.card}>
                        <h2>Decrypt with from SBT</h2>
                        <TextField id="outlined-basic" label="SBT Address" variant="outlined" onChange = {(e) => setSBTAddress(e.target.value)} />
                        <br />
                        <br />
                        <Button variant="contained" onClick={() => getSBTMetadata(SBTAddress)}>Get Metadata</Button>
                    </div>
                </div>
            </main>
            
        </div>
    );
}

export default Decrypter;

