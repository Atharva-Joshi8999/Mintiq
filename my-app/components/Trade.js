import { ethers } from "ethers";
import { useEffect, useState } from "react";
import styles from "./Trade.module.css";

function Trade({ toggleTrade, token, provider, account, factory, loadTokens }) {
  const [target, setTarget] = useState(0);
  const [limit, setLimit] = useState(0);
  const [cost, setCost] = useState(0);

  async function buyHandler(form) {
    try {
      const amount = form.get("amount");

      if (!amount || isNaN(amount) || Number(amount) <= 0) {
        alert("Please enter a valid token amount.");
        return;
      }

      const cost = await factory.getCost(token.sold);
      const total = cost * BigInt(amount);

      const signer = await provider.getSigner();
      const factoryWithSigner = factory.connect(signer);

      const tx = await factoryWithSigner.buy(
        token.token,
        ethers.parseUnits(amount.toString(), 18),
        { value: total }
      );

      await tx.wait();
      alert("Purchase Successful!");

      if (loadTokens) {
        await loadTokens();
      }

      toggleTrade();
    } catch (err) {
      console.error(err);
      alert("Transaction failed!");
    }
  }

  async function details() {
    const target = await factory.TARGET();
    setTarget(target);
    const limit = await factory.TOKEN_LIMIT();
    setLimit(limit);
    const cost = await factory.getCost(token.sold);
    setCost(cost);
  }

  useEffect(() => {
    details();
  }, []);

  return (
    <div className={styles.tradeOverlay}>
      <div className={styles.tradeContainer}>
        <button onClick={toggleTrade} className={styles.closeButton}>
          ✕
        </button>

        <div className={styles.tokenDetails}>
          {token.image && <img src={token.image} alt="token image" className={styles.tokenImage} />}

          <p className={styles.creator}>
            created by {token.creator.slice(0, 6)}...
            {token.creator.slice(38, 42)}
          </p>

          <p className={styles.marketCap}>market Cap: {ethers.formatUnits(token.raised, 18)} ETH</p>

          <p className={styles.tokenName}>{token.name}</p>
        </div>

        <h2 className={styles.title}>Trade {token.name} Token</h2>

        <div className={styles.tradeDetails}>
          <div className={styles.detailCard}>
            <p>Target</p>
            <p className={styles.detailValue}>{ethers.formatUnits(target, 18)} ETH</p>
          </div>
          <div className={styles.detailCard}>
            <p>Limit</p>
            <p className={styles.detailValue}>{ethers.formatUnits(limit, 18)} ETH</p>
          </div>
          <div className={styles.detailCard}>
            <p>Cost</p>
            <p className={styles.detailValue}>{ethers.formatUnits(cost, 18)} ETH</p>
          </div>
        </div>

        <div className={styles.buySection}>
          <h3>Buy Tokens</h3>
          {token.sold >= limit || token.raised >= limit ? (
            <p className={styles.limitMessage}>Token sale has reached its limit.</p>
          ) : (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                await buyHandler(formData);
              }}
              className={styles.buyForm}
            >
              <input
                type="number"
                name="amount"
                min={1}
                max={10000}
                placeholder="Enter Token"
                className={styles.amountInput}
              />
              <input type="submit" value="Buy Tokens" className={styles.buyButton} />
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Trade;
