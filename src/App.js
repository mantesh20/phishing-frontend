import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState("");
  const [stats, setStats] = useState({ phishing: 0, safe: 0, total: 0 });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:5000/predict", { url });
      setResult(res.data.prediction);
      fetchStats(); // Refresh stats after prediction
    } catch (err) {
      console.error(err);
      setResult("⚠️ Error: Cannot connect to backend");
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  useEffect(() => {
    fetchStats(); // Load stats on first render
  }, []);

  return (
<div
  style={{
    textAlign: "center",
    marginTop: "50px",
    fontFamily: "Arial, sans-serif",
    background: "linear-gradient(to right, #fdfbfb, #ebedee)",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
    maxWidth: "600px",
    margin: "50px auto",
  }}
>
  <h1 style={{ color: "#2c3e50", marginBottom: "30px" }}>Phishing URL Detector</h1>

  <form onSubmit={handleSubmit}>
    <input
      type="text"
      placeholder="Enter a URL"
      value={url}
      onChange={(e) => setUrl(e.target.value)}
      style={{
        width: "70%",
        padding: "12px",
        fontSize: "16px",
        border: "2px solid #ccc",
        borderRadius: "6px",
      }}
    />
    <button
      type="submit"
      style={{
        marginLeft: "10px",
        padding: "12px 20px",
        backgroundColor: "#27ae60",
        color: "white",
        border: "none",
        borderRadius: "6px",
        fontSize: "16px",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
      }}
    >
      Check
    </button>
  </form>

  <h2
    style={{
      marginTop: "30px",
      padding: "15px",
      borderRadius: "8px",
      width: "300px",
      margin: "20px auto",
      color: "#fff",
      backgroundColor:
        result === "Safe"
          ? "#2ecc71"
          : result === "Phishing"
          ? "#e74c3c"
          : "#f39c12",
      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    }}
  >
    {result === "Safe" && "✅ Safe"}
    {result === "Phishing" && "❌ Phishing"}
    {result && result !== "Safe" && result !== "Phishing" && result}
  </h2>

  <div
    style={{
      marginTop: "40px",
      borderTop: "2px solid #bdc3c7",
      paddingTop: "20px",
    }}
  >
    <h3 style={{ color: "#34495e" }}>📊 Dashboard</h3>
    <p>
      Total URLs Tested: <strong>{stats.total}</strong>
    </p>
    <p>
      Phishing: <strong style={{ color: "#e74c3c" }}>{stats.phishing}%</strong>
    </p>
    <p>
      Safe: <strong style={{ color: "#2ecc71" }}>{stats.safe}%</strong>
    </p>
  </div>
</div>
  );
}
export default App;