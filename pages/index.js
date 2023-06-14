import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import lit from "./lit";
import { useState } from "react";
import Button from "../components/Button"
import Input from '../components/Input';

const inter = Inter({ subsets: ['latin'] })


export default function Home() {

  const [encryptfiles, setEncryptfiles] = useState(null);
  const [decryptfiles, setDecryptfiles] = useState(null);


  async function handleEncryptString(){
    
    await lit.encryptString(); 
  }



  async function handleFileChange(event){
   // console.log(event.target.files); 
    setEncryptfiles(event.target.files[0]); 
    
  }

  async function handleEncryptFile(){
    console.log("*************EncryptFile***************"); 
    await lit.encryptFile(encryptfiles); 
   // and also upload to encrypt file to web3storage
  }

  async function handleDecryptFileChange(event){
    setDecryptfiles(event.target.files[0]);
  }

  async function handleDecryptFile(){
    console.log("Encrypted file: ",decryptfiles); 
    await lit.decryptFile(decryptfiles,"df0cea1a20ddc5e6e4fc79759e8772caa52a9b2fd6e5ac5018917002b95b409fc16865b492e06c2e2be04438ddb06511eb3721776212e25b3923bc190f71f3086888e11bfc339f8f3ac12534e01192cf93e53bb7955424722df934877832e8a46b03cd7729897401bbf4c612ceaf08ad1cece8811548983368ef56da3d8fd674000000000000002033ed13eb438d0e798f44759c0f36c7f851b74645dc0029d753bc726e72bf15bba9f8345080ecb6312a571a7a83853d89"); 

  }



  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div> Encrypt file
        <input type="file" name="myImage" onChange={handleFileChange} />
      </div>
     
      
      <div> Decrypt file
        <input type="file" name="myImage" onChange={handleDecryptFileChange} /> 
      </div>

      <button onClick={handleEncryptString}>encryptString and deCryptString</button>
      <button onClick={handleEncryptFile}>EncryptFile</button>
      <button onClick={handleDecryptFile}>DecryptFile</button>

      <Button/>
      <Input/>
      
      
    </>
  )
}
