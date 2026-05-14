import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SnippetCard.css";

const SnippetCard = ({ snippet }: { snippet: any }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [randomPadding, setRandomPadding] = useState("15px");
  const navigate = useNavigate();

  useEffect(() => {
    const extraPadding = Math.floor(Math.random() * 60) + 15;
    setRandomPadding(`${extraPadding}px`);
  }, []);

  const hasPhoto = snippet.title === "Modern Neon Button";

  return (
    <div
      className="snippet-wrapper"
      style={{
        paddingBottom: randomPadding,
      }}
    >
      {hasPhoto ? (
        !isFlipped ? (
          <div className="flip-card-front">
            <div className="card-header">
              <h3 className="card-title">{snippet.title}</h3>
              <button
                className="btn-turn-card"
                onClick={() => setIsFlipped(true)}
              >
                ↻ Turn Card
              </button>
            </div>
            <div className="preview-container">
              <button className="btn-explore">EXPLORE</button>
            </div>
            <button
              className="btn-navigate-page"
              onClick={() => navigate(`/snippets/${snippet._id}`)}
            >
              Move to Snippet Page →
            </button>
          </div>
        ) : (
          <div className="flip-card-back">
            <div className="card-header">
              <span className="language-badge">{snippet.language}</span>
              <button className="btn-back" onClick={() => setIsFlipped(false)}>
                ↻ Back
              </button>
            </div>
            <pre className="code-display">
              <code>{snippet.code}</code>
            </pre>
            <button
              className="btn-navigate-page"
              onClick={() => navigate(`/snippets/${snippet._id}`)}
            >
              Move to Snippet Page →
            </button>
          </div>
        )
      ) : (
        <div className="simple-card">
          <div className="card-header">
            <h3 className="card-title">{snippet.title}</h3>
            <span className="language-badge">{snippet.language}</span>
          </div>
          <pre className="code-display">
            <code>{snippet.code}</code>
          </pre>
          <button
            className="btn-navigate-page"
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
