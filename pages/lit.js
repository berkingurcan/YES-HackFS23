import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { Web3Storage } from 'web3.storage'

const client = new LitJsSdk.LitNodeClient();
const chain = "mumbai";
let ent; 

// Checks if the user has at least 0 ETH
const accessControlConditions = [
  {
    contractAddress: "",
    standardContractType: "",
    chain,
    method: "eth_getBalance",
    parameters: [":userAddress", "latest"],
    returnValueTest: {
      comparator: ">=",
      value: "10000000000000000",
    },
  },
];



class Lit {
  litNodeClient;

  async connect() {
    await client.connect();
    this.litNodeClient = client;
  }

  makeStorageClient() {
    return new Web3Storage({ token: process.env.NEXT_PUBLIC_WEB3STORAGE })
  }

  async encryptFile(file) {
    if (!this.litNodeClient) {
      await this.connect();
    }
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
    const { encryptedFile, symmetricKey } = await LitJsSdk.encryptFile({ file });

    const encryptedSymmetricKey = await this.litNodeClient.saveEncryptionKey({
      accessControlConditions: accessControlConditions,
      symmetricKey,
      authSig,
      chain,
    });

    console.log("encryptedFile: ", encryptedFile, "encryptedSymmetricKey: ", encryptedSymmetricKey, "encryptedSymmetricKey: ",
      LitJsSdk.uint8arrayToString(encryptedSymmetricKey, "base16"))

    const encryptedFiles = new File([encryptedFile], { lastModified: new Date().getTime() });
    console.log("encryptedFiles: ", encryptedFiles);
    const client = this.makeStorageClient();
    ent = (LitJsSdk.uint8arrayToString(encryptedSymmetricKey, "base16"));
   // console.log("ent: ",ent)
    const cid = await client.put([encryptedFiles]);
    console.log('stored files with cid:', cid);
    

    return {
      encryptedFile: encryptedFile,
      encryptedSymmetricKey: LitJsSdk.uint8arrayToString(encryptedSymmetricKey, "base16")
    };
  }

  async decryptFile(encryptedFile) {
    if (!this.litNodeClient) {
      await this.connect();
    }



    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
    const symmetricKey = await this.litNodeClient.getEncryptionKey({
      accessControlConditions: accessControlConditions,
      toDecrypt: ent,
      chain,
      authSig
    });

    const decryptedFile = await LitJsSdk.decryptFile({
      file: encryptedFile,
      symmetricKey
    });
    console.log("decryptedFile: ",decryptedFile)
    console.log(arrayBufferToFile(decryptedFile))
    function arrayBufferToFile(arrayBuffer, fileName, mimeType) {
    const blob = new Blob([arrayBuffer], { type: mimeType });
    return new File([blob], fileName);
  }
  function downloadFile(file, fileName) {
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(file);
    downloadLink.download = fileName;
    downloadLink.click();
    URL.revokeObjectURL(downloadLink.href);
  }

  const fileName = 'example.png';
  downloadFile(arrayBufferToFile(decryptedFile), fileName);
    
  }

  async encryptString() {
    if (!this.litNodeClient) {
      await this.connect();
    }
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
    const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(
      "this is a secret message bla bla bla"
    );
    const encryptedSymmetricKey = await window.litNodeClient.saveEncryptionKey({
      accessControlConditions,
      symmetricKey,
      authSig,
      chain,
    });
    console.log("EncrptedString: ", encryptedString, "encryptedSymmetricKey: ", encryptedSymmetricKey, "encryptedSymmetricKey: ",
      LitJsSdk.uint8arrayToString(encryptedSymmetricKey, "base16"))

    const symmetricKey1 = await this.litNodeClient.getEncryptionKey({
      accessControlConditions,
      toDecrypt: LitJsSdk.uint8arrayToString(encryptedSymmetricKey, "base16"),
      chain,
      authSig,
    });
    console.log("symmetricKey1: ", symmetricKey1);

    const decryptedString = await LitJsSdk.decryptString(
      encryptedString,
      symmetricKey1
    );

    console.log("Final: ", decryptedString);

  }






}

export default new Lit();