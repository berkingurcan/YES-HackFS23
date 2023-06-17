import { useEnsAddress } from 'wagmi'
import { useState } from 'react'
import { ethers } from 'ethers';
import * as PushAPI from "@pushprotocol/restapi";

export default function Input() {


  const [mintAddress, setMintAddress] = useState('')
  const [ensName, setEnsName] = useState('');



  const ensAddress = useEnsAddress({
    name: ensName,
  })

  async function handleMintNft() {

    const provider = new ethers.providers.Web3Provider(ethereum);
    await provider.send("eth_accounts", []);
    const signer = await provider.getSigner();

    if (isValidAddress(mintAddress) || ensAddress.data) {
      // Go and mint the nft 
      console.log("Mint")
      // after minting maybe we can listen a event
      // give to receiver a notification 

      const recipientAddress = isValidAddress(mintAddress) ? mintAddress : (ensAddress.data ? ensAddress.data : ""); 
     // console.log("recipientAddress: ",recipientAddress)
      
       const apiResponse = await PushAPI.payloads.sendNotification({
        signer: signer,
        type: 3, // target
        identityType: 2, // direct payload
        notification: {
          title: `You got a file:`,
          body: `[sdk-test] notification BODY`
        },
        payload: {
          title: `You got a file:`,
          body: `sample msg body from payload`,
          cta: '',
          img: ''
        },
        recipients: 'eip155:5:'+ recipientAddress, // recipient address
        channel: 'eip155:5:0xEaC9eDFE37fA378E8795253d292e6393d29aBCa2', // your channel address
        env: 'staging'
      });   
    }
    else {
      console.log("Give me a valid address!")
    }

   // console.log(ensAddress)
  }

  function isValidAddress(address) {
    try {
      ethers.utils.getAddress(address);
      console.log("Valid address");
      return true;
    } catch (error) {
      return false;
    }
  }
  return (<div>

    <label >Mint Nft to this address: </label>
    <input type="text" onChange={(e) => {
      setMintAddress(e.target.value)
      setEnsName(e.target.value)
    }} />
    <button onClick={handleMintNft}>Mint Nft</button>

  </div>

  )
}

