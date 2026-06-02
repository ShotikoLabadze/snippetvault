import Prism from "prismjs";
import "prismjs/plugins/autoloader/prism-autoloader";
import "prismjs/themes/prism-tomorrow.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import "./SnippetPage.css";

const SnippetPage = () => {
  const { id } = useParams();

  const [snippet, setSnippet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSingleSnippet = async () => {
      try {
        const response = await api.get(`/snippets/${id}`);
        const snippetData = response.data.data || response.data;
        setSnippet(snippetData);
      } catch (err) {
        console.error("Error fetching snippet:", err);
        setError("Snippet not found or error loading data.");
      } finally {
        setLoading(false);
      }
    };

    fetchSingleSnippet();
  }, [id]);

  useEffect(() => {
    if (snippet && Prism.plugins.autoloader) {
      Prism.plugins.autoloader.languages_path =
        "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/";
    }
    Prism.highlightAll();
  }, [snippet]);

  const handleCopy = async () => {
    if (snippet?.code) {
      try {
        await navigator.clipboard.writeText(snippet.code);
        alert("Code copied to clipboard! 🚀");
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  const handleEdit = () => alert("Edit function coming soon!");
  const handleDelete = () => alert("Delete function coming soon!");

  if (loading)
    return <div className="status-msg">Loading snippet vault...</div>;
  if (error) return <div className="status-msg error">{error}</div>;
  if (!snippet)
    return <div className="status-msg error">Snippet not found.</div>;

  return (
    <div className="snippet-page">
      <div className="snippet-layout">
        <section className="glass-panel">
          <div className="snippet-header">
            <h1 className="snippet-title">{snippet.title}</h1>
            <span className="lang-pill">
              {(snippet.language || "javascript").toLowerCase()}
            </span>
          </div>
          <p className="snippet-description">
            {snippet.description ||
              "No description provided for this snippet. You can add one by editing."}
          </p>

          <div className="code-box">
            <pre className="line-numbers">
              <code
                className={`language-${(snippet.language || "javascript").toLowerCase().trim()}`}
              >
                {(snippet.code || "").trim()}
              </code>
            </pre>
          </div>
        </section>

        <aside className="glass-panel sidebar">
          <div className="meta-list">
            <div className="meta-row">
              <span className="meta-icon">🛡</span> Created By:{" "}
              {snippet.user?.username || "user1"}
            </div>
            <div className="meta-row">
              <span className="meta-icon">📋</span> Created On:{" "}
              {new Date(snippet.createdAt).toLocaleDateString()}
            </div>
            <div className="meta-row">
              <span className="meta-icon">↻</span> Last Updated: Just now
            </div>
            <div className="meta-row">
              <span className="meta-icon">{"{}"}</span> Downloads:{" "}
              {snippet.downloads || "0"}
            </div>
            <div className="meta-row">
              <span className="meta-icon">♥</span> Likes: {snippet.likes || "0"}
            </div>
          </div>

          <div className="divider" />

          <div className="tag-cloud">
            {(snippet.tags || ["code"]).map((tag: string) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>

          <button className="btn btn-copy" onClick={handleCopy}>
            Copy Code
          </button>
          <button className="btn" onClick={handleEdit}>
            ♡ Add to Favorites
          </button>
          <button
            className="btn"
            onClick={() => alert("Link copied to share!")}
          >
            ⇗ Share Snippet
          </button>
          <button className="btn-report" onClick={handleDelete}>
            Delete Snippet
          </button>
        </aside>
      </div>
    </div>
  );
};

export default SnippetPage;
