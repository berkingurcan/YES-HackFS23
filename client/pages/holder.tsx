import { ConnectButton } from '@rainbow-me/rainbowkit';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import * as React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';


const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 60 },
    { field: 'address', headerName: 'Address', width: 150 },
    { field: 'sbtName', headerName: 'SBT Name', width: 70 },
];

const rows = [
    { id: 1, address: "0x079217e9a45A0e4B49C3cb9B6D93b127513D1F07", sbtName: 'SBT1' },
    { id: 2, address: "0x079217e9a45A0e4B49C3cb9B6D93b127513D1F07", sbtName: 'SBT2' },
];


const Holder: NextPage = () => {
    return (
        <main className={styles.main}>
            <h1>Holder Page</h1>
            <ConnectButton />
            <div className={styles.holcontainer}>
                <div className={styles.column}>
                    <h3>My Soulbound Tokens</h3>
                    <div style={{ height: 400, width: '100%' }}>
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
                        <TextField id="outlined-basic" label="SBT Address" variant="outlined" />
                        <TextField id="outlined-basic" label="To" variant="outlined" />
                        <br />
                        <br />
                        <Button variant="outlined">Mint Gate Token</Button>
                        <br />
                        <br />  
                        <Button variant="outlined">Burn Gate Token</Button>
                    </div>  
                </div>
            </div>
        </main>
    );
}

export default Holder;

