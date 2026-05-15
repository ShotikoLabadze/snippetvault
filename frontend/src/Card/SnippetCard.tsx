import Prism from "prismjs";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "prismjs/plugins/autoloader/prism-autoloader";
import "prismjs/themes/prism-tomorrow.css";

import "./SnippetCard.css";

interface Snippet {
  _id: string;
  title: string;
  language: string;
  code: string;
}

const SnippetCard = ({ snippet }: { snippet: Snippet }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [randomPadding, setRandomPadding] = useState("15px");
  const navigate = useNavigate();

  useEffect(() => {
    const extraPadding = Math.floor(Math.random() * 60) + 15;
    setRandomPadding(`${extraPadding}px`);
  }, []);

  useEffect(() => {
    if (Prism.plugins.autoloader) {
      Prism.plugins.autoloader.languages_path =
        "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/";
    }
    Prism.highlightAll();
  }, [isFlipped, snippet.code]);

  const getPrismLanguageClass = (lang: string) => {
    const cleanLang = lang?.toLowerCase().trim();

    switch (cleanLang) {
      case "c#":
      case "csharp":
      case ".net":
      case "dotnet":
        return "language-csharp";
      case "c++":
      case "cpp":
        return "language-cpp";
      case "ts":
      case "typescript":
        return "language-typescript";
      case "js":
      case "javascript":
        return "language-javascript";
      case "py":
      case "python":
        return "language-python";
      case "postgres":
      case "mysql":
      case "sqlite":
      case "sql":
        return "language-sql";
      case "dockerfile":
      case "docker":
        return "language-docker";
      case "yml":
      case "yaml":
        return "language-yaml";
      case "md":
      case "markdown":
        return "language-markdown";
      case "rb":
      case "ruby":
        return "language-ruby";
      case "kt":
      case "kotlin":
        return "language-kotlin";
      case "sh":
      case "bash":
        return "language-bash";
      default:
        return `language-${cleanLang || "javascript"}`;
    }
  };

  const langClass = getPrismLanguageClass(snippet.language);
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
            <pre className={`${langClass} code-display`}>
              <code className={langClass}>{(snippet.code || "").trim()}</code>
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
          <pre className={`${langClass} code-display`}>
            <code className={langClass}>{(snippet.code || "").trim()}</code>
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
