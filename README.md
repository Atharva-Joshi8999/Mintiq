🪙 Mintiq - Decentralized Token Launch Factory

Create and manage ERC-20 token sales with dynamic pricing, automatic sale targets, and seamless Web3 integration.
Built with Solidity, Next.js, and Ethers.js, Mintiq empowers creators to deploy, list, and trade their own tokens effortlessly.


🚀 Overview

Mintiq is a decentralized token launchpad where anyone can:

⚡ Deploy new ERC-20 tokens instantly

💰 Manage public token sales with automated price scaling

🌐 Allow buyers to purchase tokens directly using ETH

🏦 Withdraw raised ETH and remaining tokens after the sale

It also supports:

🧾 Developer fee collection

📈 Dynamic pricing logic

🔄 Real-time token listing updates

🖼️ IPFS image uploads for token metadata



🧠 Core Features
🔹 Smart Contracts (Solidity)
Factory Contract

Deploys new ERC-20 tokens

Manages token sales with auto-targeted fundraising (default: 4 ETH)

Enforces limits (500,000 tokens per sale)

Calculates token cost dynamically using bonding curve logic

Handles sale closing and post-sale deposits

Token Contract

Standard ERC-20 token using OpenZeppelin

Auto-mints total supply to the factory on creation

Tracks creator and owner of the token



🔹 Frontend (Next.js + React)
MetaMask Integration

Connect, disconnect, and manage wallets securely

Token Listing Dashboard

View active token sales with progress bars for Raised ETH and Tokens Sold

Create Token Form

Deploy new tokens directly from the browser

Upload token image to IPFS using Pinata

Dynamic UI Updates

Auto-refreshes token listings after creation

Displays success states like “🎉 Goal Reached!”



🧩 Tech Stack
Layer	Technology
Smart Contracts	Solidity (^0.8.18), OpenZeppelin ERC-20
Framework	Next.js (React 18, "use client" setup)
Blockchain Interaction	Ethers.js v6
Storage	IPFS via Pinata API
Styling	CSS Modules
Network	Ethereum / Testnets (Sepolia recommended)
⚙️ Smart Contract Summary
🏭 Factory.sol


💠 Token.sol
Function	Description
_mint()	Mints total supply on deployment
transfer()	Standard ERC-20 transfer
balanceOf()	Returns balance of an address


🖥️ Frontend Flow

1️⃣ Connect Wallet
Users connect via MetaMask. Contract & network are auto-verified.

2️⃣ Create Token
Fill in:

Token Name

Symbol

Total Supply

Upload Token Image (via IPFS Pinata)
Then click List Token to deploy.

3️⃣ Buy Tokens
Users can view all open listings and buy tokens directly with ETH.

4️⃣ Deposit & Withdraw
After reaching goal:

Creators can withdraw raised funds + unsold tokens

Developer can withdraw platform fee


📸 UI Preview
Feature	Description
🧱 Dashboard	Displays all active token sales with live progress bars
🪄 Create Page	Form to deploy new tokens
🔁 Trade Modal	Buy tokens directly
🌐 IPFS Upload	Upload token image securely using Pinata
🔐 Security Checks

✅ Contract reverts on insufficient ETH or invalid input
✅ Tokens auto-locked to prevent overselling
✅ Only owner/creator can perform privileged actions
✅ Uses OpenZeppelin ERC-20 for secure token logic

🧰 Local Setup
📦 Prerequisites
Node.js (v18+)

MetaMask Wallet

Foundry / Hardhat (for testing)

Pinata API keys (for IPFS uploads)


🪜 Steps

# 1. Clone the repository
git clone https://github.com/Atharva-Joshi8999/Mintiq.git

# 2. Install dependencies
cd MintiqFrontend
npm install

# 3. Add environment variables
# Create .env.local file
NEXT_PUBLIC_PINATA_API_KEY=your_api_key
NEXT_PUBLIC_PINATA_API_SECRET=your_api_secret

# 4. Run the app
npm run dev


Then open:
👉 http://localhost:3000

🧪 Smart Contract Deployment

Deploy Factory contract using Foundry:

forge create src/Factory.sol:Factory \
--constructor-args 0.01ether \
--rpc-url <RPC_URL> \
--private-key <PRIVATE_KEY>


Then update contract address in:

// src/contract.js
export const contractAddress = "<YOUR_DEPLOYED_ADDRESS>";

👨‍💻 Author

Atharva Joshi
🧩 Blockchain & Web3 Developer
📍 Nashik, India

🪪 License

This project is licensed under the MIT License.
Feel free to fork and build upon it!
