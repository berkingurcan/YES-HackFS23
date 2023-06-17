import { useAccount, useEnsAddress   } from 'wagmi'
import { useState } from 'react'
import { ethers } from 'ethers';

export default function Input() {
  const { address, isConnecting, isDisconnected } = useAccount()

  const [mintAddress, setMintAddress] = useState('')
  const [ensName, setEnsName] = useState('');

  const ensAddress = useEnsAddress({
    name:ensName,
  })

async function handleMintNft(){
     if( isValidAddress(mintAddress) || ensAddress.data )
    {
        // Go and mint the nft 
        console.log("Mint")
    } 
    else{
      console.log("Give me a valid address!")
    }
   
   console.log(ensAddress)
}

function isValidAddress(address) {
    try {
      ethers.utils.getAddress(address);
      console.log("Valid address");
      return true;
    } catch (error) {
        console.log("Invalid address")
      return false;
    }
  }
 return (<div> 
    
    <label >Mint Nft to this address: </label>
    <input type="text" onChange={(e) => {setMintAddress(e.target.value)
    setEnsName(e.target.value)}} />
    <button onClick={handleMintNft}>Mint Nft</button>
   
  </div>

  )
}

