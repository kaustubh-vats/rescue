import React, { useState } from "react";
import "./App.css";

const API_BASE = import.meta.env.VITE_API_BASE;

const App: React.FC = () => {
  const [input, setInput] = useState("");
  const [edited, setEdited] = useState("");
  const [decoded, setDecoded] = useState("");
  const [error, setError] = useState("");

  const handleEncode = async () => {
    setError("");
    setDecoded("");
    try {
      const res = await fetch(`${API_BASE}/encode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: input }),
      });
      const data = await res.json();
      setEdited(data.encoded);
    } catch {
      setError("Failed to encode");
    }
  };

  const handleDecode = async () => {
    setError("");
    try {
      const res = await fetch(`${API_BASE}/decode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ encoded: edited }),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      setDecoded(data.decoded);
    } catch {
      setError("Failed to decode");
    }
  };

  return (
    <div className="app-container">
      <h1>RS String Encoder / Decoder</h1>

      <div className="card">
        <label>Enter Original String:</label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type here..."
        />
        <button className="btn encode-btn" onClick={handleEncode}>
          Encode
        </button>
      </div>

      { (
        <div className="card">
          <label htmlFor="encoded-textarea">Encoded String (Edit original part only, use _ for missing):</label>
          <textarea
            id="encoded-textarea"
            value={edited}
            onChange={(e) => setEdited(e.target.value)}
            rows={3}
            className="encoded-textarea"
          />
          <button className="btn decode-btn" onClick={handleDecode}>
            Decode
          </button>
        </div>
      )}

      {decoded && (
        <div className="card output-card">
          <label>Decoded String:</label>
          <div className="decoded">{decoded}</div>
        </div>
      )}

      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default App;
