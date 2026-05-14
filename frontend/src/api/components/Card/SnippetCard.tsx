import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SnippetCard = ({ snippet }: { snippet: any }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const navigate = useNavigate();

  const hasPhoto = snippet.title === "Modern Neon Button";

  return (
    <div
      className="snippet-wrapper"
      style={{
        border: "1px solid gray",
        padding: "15px",
        margin: "10px 0",
        borderRadius: "8px",
        background: "#1a1a2e",
        color: "white",
      }}
    >
      {hasPhoto ? (
        !isFlipped ? (
          <div className="flip-card-front">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3 style={{ margin: 0 }}>{snippet.title}</h3>
              <button
                style={{
                  cursor: "pointer",
                  padding: "5px 10px",
                  background: "#333",
                  color: "#00c3ff",
                  border: "1px solid #00c3ff",
                  borderRadius: "5px",
                }}
                onClick={() => setIsFlipped(true)}
              >
                ↻ Turn Card
              </button>
            </div>

            <div
              style={{
                padding: "40px 20px",
                textAlign: "center",
                background: "#0f0f1a",
                margin: "15px 0",
                borderRadius: "8px",
                border: "1px dashed #00c3ff",
              }}
            >
              <button
                style={{
                  padding: "10px 30px",
                  background: "transparent",
                  color: "#00c3ff",
                  border: "2px solid #00c3ff",
                  borderRadius: "8px",
                  boxShadow: "0 0 10px #00c3ff",
                }}
              >
                EXPLORE
              </button>
            </div>

            <button
              style={{
                width: "100%",
                padding: "10px",
                background: "#222",
                color: "white",
                border: "none",
                cursor: "pointer",
                borderRadius: "5px",
              }}
              onClick={() => navigate(`/snippets/${snippet._id}`)}
            >
              Move to Snippet Page →
            </button>
          </div>
        ) : (
          <div className="flip-card-back">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <span style={{ fontWeight: "bold", color: "#ffaa00" }}>
                {snippet.language}
              </span>
              <button
                style={{
                  cursor: "pointer",
                  padding: "5px 10px",
                  background: "#333",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                }}
                onClick={() => setIsFlipped(false)}
              >
                ↺ Back
              </button>
            </div>

            <pre
              style={{
                background: "#000",
                color: "#0f0",
                padding: "10px",
                borderRadius: "4px",
                overflowX: "auto",
                fontSize: "14px",
              }}
            >
              <code>{snippet.code}</code>
            </pre>

            <button
              style={{
                width: "100%",
                padding: "10px",
                background: "#222",
                color: "white",
                border: "none",
                cursor: "pointer",
                borderRadius: "5px",
                marginTop: "10px",
              }}
              onClick={() => navigate(`/snippets/${snippet._id}`)}
            >
              Move to Snippet Page →
            </button>
          </div>
        )
      ) : (
        <div className="simple-card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
              alignItems: "center",
            }}
          >
            <h3 style={{ margin: 0 }}>{snippet.title}</h3>
            <span
              style={{
                fontWeight: "bold",
                color: "#ffaa00",
                fontSize: "14px",
                background: "#333",
                padding: "3px 8px",
                borderRadius: "4px",
              }}
            >
              {snippet.language}
            </span>
          </div>

          <pre
            style={{
              background: "#000",
              color: "#0f0",
              padding: "15px",
              borderRadius: "6px",
              overflowX: "auto",
              fontSize: "14px",
              maxHeight: "200px",
            }}
          >
            <code>{snippet.code}</code>
          </pre>

          <button
            style={{
              width: "100%",
              marginTop: "15px",
              padding: "10px",
              background: "#222",
              color: "white",
              border: "none",
              cursor: "pointer",
              borderRadius: "5px",
            }}
            onClick={() => navigate(`/snippets/${snippet._id}`)}
          >
            Move to Snippet Page →
          </button>
        </div>
      )}
    </div>
  );
};

export default SnippetCard;
