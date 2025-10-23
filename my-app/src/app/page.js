"use client";
import React from "react";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Header from "../../components/Header";
import Token from "../../components/Token";
import Trade from "../../components/Trade";
import Style from "./page.module.css";
import { abi, contractAddress } from "../../contract";
import List from "../../components/List";

function Home() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [factory, setFactory] = useState(null);
  const [fee, setFee] = useState(0);
  const [tokens, setTokens] = useState([]);
  const [token, setToken] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showTrade, setShowTrade] = useState(false);

  try{
  useEffect(()=>{
    if (!window.ethereum)
      {
        alert("Please install MetaMask to use this dApp!");
      } else {
        loadWallet();
      }
  }, []);
} catch (error){
  console.error("Install MetaMask:", error);
}

async function disconnectWallet() {
  try {
    
    if (window.ethereum?.request) {
      await window.ethereum.request({
        method: "wallet_revokePermissions",
        params: [{ eth_accounts: {} }],
      });
    }

    
    setAccount(null);
    setProvider(null);
    setFactory(null);
    setTokens([]);
    setToken(null);
    setShowCreate(false);
    setShowTrade(false);

    
    localStorage.removeItem("connected");
    console.log("🔌 Wallet disconnected successfully.");
  } catch (error) {
    console.error("Failed to disconnect wallet:", error);
  }
}


  function toggleButton() {
    showCreate ? setShowCreate(false) : setShowCreate(true);
  }

  function toggleTrade(token) {
    setToken(token);
    showTrade ? setShowTrade(false) : setShowTrade(true);
  }

  async function loadTokens() {
    if (!factory) return;

    console.log("🔄 Loading tokens...");
    const localTokens = JSON.parse(localStorage.getItem("createdTokens")) || [];
    const totalTokens = [];
    const tokenSaleCount = await factory.tokenCount();

    console.log(`Total tokens created: ${tokenSaleCount}`);

    for (let i = 0; i < tokenSaleCount; i++) {
      const tokenDisplay = await factory.getTokenSale(i);

      console.log(`Token ${i}: ${tokenDisplay.name}, isOpen: ${tokenDisplay.isOpen}`);

      if (!tokenDisplay.isOpen) {
        console.log(` Token ${tokenDisplay.name} is CLOSED, skipping...`);
        continue;
      }

      console.log(` Token ${tokenDisplay.name} is OPEN, adding to list`);

      const token = {
        token: tokenDisplay.token,
        address: tokenDisplay.address,
        name: tokenDisplay.name,
        creator: tokenDisplay.creator,
        sold: tokenDisplay.sold,
        raised: tokenDisplay.raised,
        isOpen: tokenDisplay.isOpen,
      };

      const match = localTokens.find(
        (t) => t.name.trim().toLowerCase() === tokenDisplay.name.trim().toLowerCase()
      );

      if (match) {
        token.image = match.image;
      }

      totalTokens.push(token);
    }

    setTokens(totalTokens.reverse());
    console.log(`Loaded ${totalTokens.length} open tokens`);
  }

  async function loadWallet() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    setProvider(provider);

    const network = await provider.getNetwork();
    console.log("Connected to network:", network.name, "Chain ID:", network.chainId);

    const code = await provider.getCode(contractAddress);
    console.log("Contract code length:", code.length);

    if (code === "0x") {
      console.error(" NO CONTRACT FOUND AT ADDRESS:", contractAddress);
      alert(
        "Contract not deployed on this network! Please check your network and contract address."
      );
      return;
    }

    console.log(" Contract found at address:", contractAddress);

    const factory = new ethers.Contract(contractAddress, abi, provider);
    setFactory(factory);

    try {
      const fee = await factory.fee();
      setFee(fee);
      console.log(" Contract is working! Fee:", ethers.formatEther(fee), "ETH");
    } catch (error) {
      console.error(" Error calling contract:", error);
    }
  }

  useEffect(() => {
    loadWallet();
  }, []);

  useEffect(() => {
    if (factory) {
      loadTokens();
    }
  }, [factory]);

  useEffect(() => {
    if (fee) {
      console.log("Contract fee:", ethers.formatEther(fee), "ETH");
    }
  }, [fee]);

  return (
    <div className={Style.Home}>
      <Header account={account} setAccount={setAccount} />

      <main>
        <div className={Style.mainContent}>
          <button
            onClick={() => {
              if (factory && account) toggleButton();
            }}
            className={Style.button2}
            disabled={!factory || !account}
          >
            {!factory
              ? "Contract Not Deployed"
              : !account
                ? "Connect Metamask"
                : "Create Your New Token"}
          </button>
          <button
  onClick={disconnectWallet}
  className={Style.button2}
  style={{ marginTop: "10px", backgroundColor: "#ff4d4d" }}
>
  🔌 Disconnect Wallet
</button>


          <button
            onClick={loadTokens}
            className={Style.button2}
            disabled={!factory}
            style={{ marginTop: "10px" }}
          >
            🔄 Refresh Listings
          </button>
        </div>

        <div className="listings">
          <h1>New Listings</h1>

          <div className="tokens">
            {!account ? (
              <p>Please connect wallet</p>
            ) : tokens.length === 0 ? (
              <p>No tokens listed</p>
            ) : (
              tokens.map((token, index) => (
                <Token key={index} token={token} toggleTrade={toggleTrade} />
              ))
            )}
          </div>
        </div>
      </main>

      {showCreate && (
        <List
          toggleButton={toggleButton}
          fee={fee}
          provider={provider}
          factory={factory}
          loadTokens={loadTokens}
        />
      )}

      {showTrade && (
        <Trade
          toggleTrade={toggleTrade}
          token={token}
          provider={provider}
          account={account}
          factory={factory}
          loadTokens={loadTokens}
        />
      )}
    </div>
  );
}

export default Home;
