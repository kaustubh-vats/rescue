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
      if (data.error) setError(data.error);
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
      <h1>Rescue Words</h1>
      <p className="description">
        Enter any text to generate a protected version. You can then replace some characters with _, and our tool will still recover the original message. See how data can be recovered even when parts are missing!
        Refresh the page, or access from another device, the original message can still be recovered. No data is stored anywhere—it’s all handled with pure math!
      </p>

      <div className="card">
        <label>Enter Original String:</label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type here..."
          onKeyDown={(e) => { if (e.key === 'Enter') handleEncode(); }}
        />
        <button type="button" className="btn encode-btn" onClick={handleEncode}>
          Encode
        </button>
      </div>

      { (
        <div className="card">
          <label htmlFor="encoded-textarea">Encoded String (Edit original part only, remove some characters from the string and add _ in place of the missing characters):</label>
          <textarea
            id="encoded-textarea"
            value={edited}
            onChange={(e) => setEdited(e.target.value)}
            rows={3}
            className="encoded-textarea"
            placeholder="Encoded string will appear here... Or enter your already encoded string."
          />
          <button type="button" className="btn decode-btn" onClick={handleDecode}>
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

      <h2 className="howto-heading">How to Use</h2>

      {/* If YouTube video */}
      <video className="video-wrapper" src="/help.mp4" controls>
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default App;
