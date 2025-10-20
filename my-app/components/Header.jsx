import { ethers } from "ethers";
import Style from "./Header.module.css";

function Header({ account, setAccount }) {
  async function connectWallet() {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    const account = ethers.getAddress(accounts[0]);

    setAccount(account);
  }

  return (
    <header>
      <h1 className={Style.Title}>Welcome to Mintiq</h1>

      {account ? (
        <button className={Style.btn}>
          [{account.slice(0, 5) + "..." + account.slice(38, 42)}]
        </button>
      ) : (
        <button onClick={connectWallet} className={Style.button2}>
          Connect Wallet
        </button>
      )}
    </header>
  );
}

export default Header;
