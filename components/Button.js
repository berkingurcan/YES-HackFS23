import { useAccount, useConnect, useEnsName,useEnsAddress   } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Button() {
  const { address, isConnecting, isDisconnected } = useAccount()
  const { data, isError, isLoading } = useEnsName({
    address: address,
  })

  return (<div> Here is ensName: {data}
    <div><ConnectButton /> </div>
  </div>

  )
}

