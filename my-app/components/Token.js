import { ethers } from "ethers";

function Token({ toggleTrade, token }) {
  const TARGET = ethers.parseEther("4");
  const TOKEN_LIMIT = ethers.parseEther("500000");

  const raisedProgress = (Number(token.raised) / Number(TARGET)) * 100;
  const soldProgress = (Number(token.sold) / Number(TOKEN_LIMIT)) * 100;

  return (
    <button onClick={() => toggleTrade(token)} className="token">
      <div className="token_details">
        {token.image && (
          <img
            src={token.image}
            alt="token image"
            width={256}
            height={256}
            style={{
              borderRadius: "10px",
              objectFit: "cover",
            }}
          />
        )}

        <p style={{ fontSize: "14px", color: "#888", marginTop: "10px" }}>
          created by {token.creator.slice(0, 6)}...
          {token.creator.slice(38, 42)}
        </p>

        <p className="name" style={{ fontSize: "20px", fontWeight: "bold", margin: "10px 0" }}>
          {token.name}
        </p>

        <div style={{ width: "100%", marginTop: "10px" }}>
          <div style={{ marginBottom: "15px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
              <span style={{ fontSize: "12px" }}>Raised</span>
              <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                {ethers.formatUnits(token.raised, 18)} / 4 ETH
              </span>
            </div>
            <div
              style={{
                width: "100%",
                height: "8px",
                backgroundColor: "#e0e0e0",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${Math.min(raisedProgress, 100)}%`,
                  height: "100%",
                  backgroundColor: raisedProgress >= 100 ? "#4caf50" : "#2196f3",
                  transition: "width 0.3s ease",
                }}
              />
            </div>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
              <span style={{ fontSize: "12px" }}>Tokens Sold</span>
              <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                {Number(ethers.formatUnits(token.sold, 18)).toLocaleString()} tokens
              </span>
            </div>
            <div
              style={{
                width: "100%",
                height: "8px",
                backgroundColor: "#e0e0e0",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${Math.min(soldProgress, 100)}%`,
                  height: "100%",
                  backgroundColor: soldProgress >= 100 ? "#4caf50" : "#ff9800",
                  transition: "width 0.3s ease",
                }}
              />
            </div>
          </div>
        </div>

        {(raisedProgress >= 100 || soldProgress >= 100) && (
          <div
            style={{
              marginTop: "10px",
              padding: "5px 10px",
              backgroundColor: "#4caf50",
              color: "white",
              borderRadius: "5px",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            🎉 Goal Reached!
          </div>
        )}
      </div>
    </button>
  );
}

export default Token;
