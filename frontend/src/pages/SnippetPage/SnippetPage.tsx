import Prism from "prismjs";
import "prismjs/plugins/autoloader/prism-autoloader";
import "prismjs/themes/prism-tomorrow.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

const SnippetPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [snippet, setSnippet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);

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
  }, [snippet, isFlipped]);

  const handleCopy = () => alert("Copy function coming soon!");
  const handleEdit = () => alert("Edit function coming soon!");
  const handleDelete = () => alert("Delete function coming soon!");

  if (loading) return <p>Loading snippet vault...</p>;
  if (error) return <p>{error}</p>;
  if (!snippet) return <p>Snippet not found.</p>;

  return (
    <div>
      <div>
        <h1>{snippet.title}</h1>
        <div>
          <div>Author: @{snippet.userId || "user1"}</div>
          <div>Created: {new Date(snippet.createdAt).toLocaleDateString()}</div>
          <div>
            Tags:{" "}
            {(snippet.tags || []).map((tag: string) => (
              <span key={tag} style={{ marginRight: "10px" }}>
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ margin: "20px 0" }}>
        <button onClick={handleCopy}>Copy</button>
        <button onClick={handleEdit}>Edit</button>
        <button onClick={handleDelete}>Delete</button>
      </div>

      <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
        <div style={{ flex: 1, maxWidth: "100%", overflowX: "auto" }}>
          <pre>
            <code
              className={`language-${(snippet.language || "").toLowerCase().trim()}`}
            >
              {(snippet.code || "").trim()}
            </code>
          </pre>
        </div>

        {snippet.imageUrl && (
          <div style={{ width: "300px", flexShrink: 0 }}>
            {isFlipped ? (
              <div>
                <h3>Snippet Details</h3>
                <p>
                  Language: <strong>{snippet.language}</strong>
                </p>
                <p>Author notes could go here...</p>
                <button onClick={() => setIsFlipped(false)}>
                  ↺ Back to Preview
                </button>
              </div>
            ) : (
              <div>
                <img
                  src={snippet.imageUrl}
                  alt="Live Preview"
                  style={{
                    width: "100%",
                    display: "block",
                    marginBottom: "10px",
                  }}
                />
                <button onClick={() => setIsFlipped(true)}>↻ Turn Card</button>
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ marginTop: "30px", display: "flex", gap: "10px" }}>
        <button>Share Snippet</button>
        <button onClick={() => navigate("/dashboard")}>
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default SnippetPage;
