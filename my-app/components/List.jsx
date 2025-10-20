"use client";

import axios from "axios";
import { ethers } from "ethers";
import Style from "./List.module.css";
import { useState } from "react";

function List({ toggleButton, fee, provider, factory, loadTokens }) {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  async function ListHandler(event) {
    event.preventDefault();

    if (!provider || !factory) {
      alert("Blockchain objects not ready");
      return;
    }

    try {
      const formData = new FormData(event.target);
      const name = formData.get("name");
      const symbol = formData.get("symbol");
      const totalSupply = ethers.parseUnits(formData.get("totalSupply").toString(), 18);

      const signer = await provider.getSigner();
      const tx = await factory.connect(signer).create(name, symbol, totalSupply, {
        value: fee,
      });

      await tx.wait();
      alert("Token created Successfully");

      const createdToken = {
        name,
        symbol,
        totalSupply: formData.get("totalSupply"),
        image: fileUrl,
      };

      let localTokens = JSON.parse(localStorage.getItem("createdTokens")) || [];
      localTokens.push(createdToken);
      localStorage.setItem("createdTokens", JSON.stringify(localTokens));

      // Refresh the token list after successful creation
      if (loadTokens) {
        await loadTokens();
      }

      toggleButton();
    } catch (error) {
      alert("Supply of token is too low.");

      if (error.code === "INSUFFICIENT_FUNDS") {
        alert("Insufficient Fund..");
      } else if (error.code === "ACTION_REJECTED") {
        alert("Action rejected by the user");
      } else {
        alert("Something went wrong while creating the token.");
        console.error(error);
      }
    }
  }

  const handleIpfs = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file first");

    setUploading(true);
    console.log(file);

    try {
      const dataFile = new FormData();
      dataFile.append("file", file);

      const responseData = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: dataFile,
        headers: {
          pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
          pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_API_SECRET,
          "Content-Type": "multipart/form-data",
        },
      });

      const fileUrl = "https://ipfs.io/ipfs/" + responseData.data.IpfsHash;
      console.log("File URL:", fileUrl);
      setFileUrl(fileUrl);
      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Error Occurred:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={Style.List}>
      <h1>List New Token</h1>
      <p>Fee: {fee ? ethers.formatEther(fee) : "0"} ETH</p>

      <form onSubmit={ListHandler} className={Style.form}>
        <input type="text" name="name" placeholder="Token Name" className={Style.input} required />

        <input
          type="text"
          name="symbol"
          placeholder="Token Symbol (e.g., RY)"
          className={Style.inputSymbol}
          required
        />

        <input
          type="number"
          name="totalSupply"
          placeholder="Total Supply"
          className={Style.input}
          min="1"
          required
        />

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />

        {fileUrl && (
          <div className={Style.imagePreview}>
            <img src={fileUrl} alt="Token Preview" />
          </div>
        )}

        <button type="button" onClick={handleIpfs} disabled={!file || uploading}>
          {uploading ? "Uploading..." : "Upload File"}
        </button>

        <input type="submit" value="[ List Token ]" className={Style.button2} disabled={!fileUrl} />
      </form>

      <button onClick={toggleButton} className={Style.btn}>
        ✕
      </button>
    </div>
  );
}

export default List;
