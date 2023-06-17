import '../styles/globals.css'
import "@rainbow-me/rainbowkit/styles.css";
import { WagmiConfig, createConfig, configureChains} from 'wagmi'
import {
  filecoinCalibration,
  goerli,polygonMumbai
} from "wagmi/chains";
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { InjectedConnector } from 'wagmi/connectors/injected'
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
 
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [goerli,filecoinCalibration,polygonMumbai],
  [alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_GOERLI_RPC_URL }),publicProvider()],
)

const { connectors } = getDefaultWallets({
  chains,
});

const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});


export default function App({ Component, pageProps }) {
  return (<WagmiConfig config={config }>
    <RainbowKitProvider chains={chains}>
      <Component {...pageProps} />
    </RainbowKitProvider>
  </WagmiConfig>)
}
