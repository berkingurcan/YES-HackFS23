import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';


const Issuer: NextPage = () => {
    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <h1>Issuer Page</h1>
                <ConnectButton />
                

            </div>
        </main>
    );
}

export default Issuer;

