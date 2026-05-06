import { useState } from "react";
import api from "../api/client";

export default function LinkPartner() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleLink = async () => {
    setMessage("");
    setError("");

    if (!email) {
      setError("Please enter partner email");
      return;
    }

    try {
      const res = await api.post("/partner/link", {
        email: email,
      });

      if (res.data.error) {
        setError(res.data.error);
        return;
      }

      setMessage("✅ Partner linked successfully!");
      setEmail("");

    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🤝 Link Your Partner</h2>

        {error && <div style={styles.error}>{error}</div>}
        {message && <div style={styles.success}>{message}</div>}

        <input
          type="email"
          placeholder="Enter partner email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <button style={styles.button} onClick={handleLink}>
          Link Partner
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    padding: "40px",
  },
  card: {
    width: "400px",
    padding: "25px",
    borderRadius: "16px",
    background: "#ffffff",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    textAlign: "center" as const,
  },
  title: {
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },
  button: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    background: "#4CAF50",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },
  error: {
    background: "#ffe5e5",
    color: "#d8000c",
    padding: "8px",
    marginBottom: "10px",
    borderRadius: "6px",
  },
  success: {
    background: "#e6ffed",
    color: "#2e7d32",
    padding: "8px",
    marginBottom: "10px",
    borderRadius: "6px",
  },
};