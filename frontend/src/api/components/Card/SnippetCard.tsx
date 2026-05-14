import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Card = ({ snippet }: { snippet: any }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className="snippet-wrapper"
      style={{
        border: "1px solid gray",
        padding: "10px",
        margin: "10px 0",
        borderRadius: "8px",
      }}
    >
      {!isFlipped ? (
        <div className="flip-card-front">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h3>{snippet.title}</h3>
            <button onClick={() => setIsFlipped(true)}>↻ Turn Card</button>
          </div>

          <div
            style={{
              padding: "20px",
              textAlign: "center",
              background: "#e9ecef",
              margin: "10px 0",
            }}
          >
            <button
              style={{
                padding: "10px 20px",
                background: "blue",
                color: "white",
                border: "none",
              }}
            >
              EXPLORE
            </button>
          </div>

          <button onClick={() => navigate(`/snippets/${snippet._id}`)}>
            Move to Snippet Page →
          </button>
        </div>
      ) : (
        <div className="flip-card-back">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontWeight: "bold", color: "orange" }}>
              {snippet.language}
            </span>
            <button onClick={() => setIsFlipped(false)}>↺ Back to View</button>
          </div>

          <pre
            style={{
              background: "#222",
              color: "#0f0",
              padding: "10px",
              borderRadius: "4px",
              overflowX: "auto",
            }}
          >
            <code>{snippet.code}</code>
          </pre>
        </div>
      )}
    </div>
  );
};

export default Card;
