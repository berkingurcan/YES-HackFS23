import { ConnectButton } from "@rainbow-me/rainbowkit";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import * as React from "react";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { useState } from "react";
import GateToken from "../../contracts/artifacts/contracts/GateToken.sol/GateToken.json";
import { ethers } from "ethers";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 60 },
  { field: "address", headerName: "Address", width: 150 },
  { field: "sbtName", headerName: "SBT Name", width: 70 },
];

const rows = [
  {
    id: 1,
    address: "0x079217e9a45A0e4B49C3cb9B6D93b127513D1F07",
    sbtName: "SBT1",
  },
  {
    id: 2,
    address: "0x079217e9a45A0e4B49C3cb9B6D93b127513D1F07",
    sbtName: "SBT2",
  },
];

const GateTokenAbi = GateToken.abi;

const Holder: NextPage = () => {
  const[gateAddress, setGateAddress] = useState("");
  const[to, setTo] = useState("");

  async function mint() {
    console.log("minting");
    const provider = new ethers.BrowserProvider(window.ethereum)
    await provider.send("eth_accounts", []);
    const signer = await provider.getSigner();

    const GateToken = new ethers.Contract(gateAddress, GateTokenAbi, signer);
    const mintTx = await GateToken.mint(to); 
    const receipt = await mintTx.wait();
    console.log(receipt);
    console.log("Minted to: ", to );
  }
  
  async function burn() {
    console.log("burning");
    const provider = new ethers.BrowserProvider(window.ethereum)
    await provider.send("eth_accounts", []);
    const signer = await provider.getSigner();

    const GateToken = new ethers.Contract(gateAddress, GateTokenAbi, signer);
    const burnTx = await GateToken.burnFromVerifier(to);
    const receipt = await burnTx.wait();
    console.log(receipt);
    console.log("Burned from: ", to );
  }

  return (
    <main className={styles.main}>
      <h1>Holder Page</h1>
      <ConnectButton />
      <div className={styles.holcontainer}>
        <div className={styles.column}>
          <h3>My Soulbound Tokens</h3>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
                },
              }}
              pageSizeOptions={[5, 10]}
              checkboxSelection
            />
          </div>
        </div>
        <div className={styles.column}>
          <h3>Mint Gate Token</h3>
          <div className={styles.card}>
            <TextField
              id="outlined-basic"
              label="Gate Address"
              variant="outlined"
              onChange={(e) => setGateAddress(e.target.value)}
            />
            <TextField id="outlined-basic" label="To" variant="outlined" onChange={(e) => setTo(e.target.value)} />
            <br />
            <br />
            <Button variant="outlined" onClick={mint}>SHOW YOUR DOCUMENT TO VERIFIER </Button>
            <br />
            <br />
            <Button variant="outlined" onClick={burn}>END UP ACCESS OF YOUR DOCUMENT</Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Holder;
