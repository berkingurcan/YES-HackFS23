import * as React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { Web3Storage } from 'web3.storage';
import { zeroETHaccess } from '../utils/zeroETHaccess';
import { tenthETHaccess } from '../utils/tenthETHaccess';


const client = new LitJsSdk.LitNodeClient();
let ent;






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
                    <Button variant="outlined">Upload File To Filecoin</Button>
                    <br />
                    <br />

                    <TextField id="outlined-basic" label="holder address" variant="outlined" />
                    <br />
                    <br />

                    <Button variant="outlined">Mint SBT</Button>
                </div>
                <div className={styles.card}>
                    <h2>Deploy Gate Token for Holder</h2>
                    <TextField id="outlined-basic" label="holder address" variant="outlined" />
                    <br />
                    <br />
                    <Button variant="outlined">Deploy Gate Token</Button>
                </div>  
            </div>
        </main>
    );
}

export default Issuer;

