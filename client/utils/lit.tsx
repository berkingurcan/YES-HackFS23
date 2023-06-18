import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { Web3Storage } from "web3.storage";


const client = new LitJsSdk.LitNodeClient();
const chain = "hyperspace";
let ent: any;

class Lit {
  litNodeClient: LitJsSdk.LitNodeClient | undefined;

  async connect() {
    await client.connect();
    this.litNodeClient = client;
  }

  makeStorageClient() {
    return new Web3Storage({ token: process.env.NEXT_PUBLIC_WEB3STORAGE });
  }

  async encryptFile(file: any, accessControlCondition: any) {
    if (!this.litNodeClient) {
      await this.connect();
    }
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
    const { encryptedFile, symmetricKey } = await LitJsSdk.encryptFile({
      file,
    });

    const encryptedSymmetricKey = await this.litNodeClient.saveEncryptionKey({
      accessControlConditions: accessControlCondition,
      symmetricKey,
      authSig,
      chain,
    });

    console.log(
      "encryptedFile: ",
      encryptedFile,
      "encryptedSymmetricKey: ",
      encryptedSymmetricKey,
      "encryptedSymmetricKey: ",
      LitJsSdk.uint8arrayToString(encryptedSymmetricKey, "base16")
    );

    const encryptedFiles = new File([encryptedFile], {
      lastModified: new Date().getTime(),
    });
    console.log("encryptedFiles: ", encryptedFiles);

    const client = this.makeStorageClient();

    ent = LitJsSdk.uint8arrayToString(encryptedSymmetricKey, "base16");
    console.log("ent: ", ent);

    const cid = await client.put([encryptedFiles]);
    console.log("stored files with cid:", cid);

    return {
      encryptedFile: encryptedFile,
      encryptedSymmetricKey: LitJsSdk.uint8arrayToString(
        encryptedSymmetricKey,
        "base16"
      ),
      cid: cid,
      ent: ent,
    };
  }

  async decryptFile(encryptedFile: any) {
    if (!this.litNodeClient) {
      await this.connect();
    }

    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });

    const symmetricKey = await this.litNodeClient.getEncryptionKey({
      accessControlConditions: zeroETHaccessControlCondition,
      toDecrypt: ent,
      chain,
      authSig,
    });

    const decryptedFile = await LitJsSdk.decryptFile({
      file: encryptedFile,
      symmetricKey,
    });

    console.log("decryptedFile: ", decryptedFile);

    function arrayBufferToFile(
      arrayBuffer: BlobPart,
      fileName: string | undefined,
      mimeType: undefined
    ) {
      const blob = new Blob([arrayBuffer], { type: mimeType });
      return new File([blob], fileName);
    }

    console.log(arrayBufferToFile(decryptedFile));

    function downloadFile(file: Blob | MediaSource, fileName: string) {
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(file);
      downloadLink.download = fileName;
      downloadLink.click();
      URL.revokeObjectURL(downloadLink.href);
    }

    const fileName = "example.png";
    downloadFile(arrayBufferToFile(decryptedFile), fileName);
  }

  async encryptString(stringName: string) {
    if (!this.litNodeClient) {
      await this.connect();
    }

    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
    const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(
      stringName
    );

    const encryptedSymmetricKey = await window.LitNodeClient.saveEncryptionKey({
      zeroETHaccessControlCondition,
      symmetricKey,
      authSig,
      chain,
    });

    console.log(
      "EncrptedString: ",
      encryptedString,
      "encryptedSymmetricKey: ",
      encryptedSymmetricKey,
      "encryptedSymmetricKey: ",
      LitJsSdk.uint8arrayToString(encryptedSymmetricKey, "base16")
    );

    const symmetricKey1 = await this.litNodeClient.getEncryptionKey({
      accessControlConditions: zeroETHaccessControlCondition,
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

// eslint-disable-next-line import/no-anonymous-default-export
export default new Lit();
