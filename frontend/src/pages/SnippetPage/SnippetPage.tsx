import {
  Calendar,
  Check,
  Code2,
  Copy,
  Heart,
  Hourglass,
  Loader2,
  Pencil,
  RefreshCw,
  Share2,
  Shield,
  Sparkles,
  Trash2,
} from "lucide-react";
import Prism from "prismjs";
import "prismjs/plugins/autoloader/prism-autoloader";
import "prismjs/themes/prism-tomorrow.css";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import { SnippetAPI } from "../../api/snippets";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import "./SnippetPage.css";

const SnippetPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [snippet, setSnippet] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    language: "typescript",
    code: "",
    tags: "",
  });
  const [saveLoading, setSaveLoading] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiCooldown, setAiCooldown] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (aiCooldown <= 0) return;
    const timer = setInterval(() => {
      setAiCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [aiCooldown]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [snippetData, userRes] = await Promise.all([
        SnippetAPI.getById(id!),
        api.get("/users/me").catch(() => ({ data: null })),
      ]);
      setSnippet(snippetData);
      setEditForm({
        title: snippetData.title || "",
        description: snippetData.description || "",
        language: snippetData.language || "typescript",
        code: snippetData.code || "",
        tags: snippetData.tags ? snippetData.tags.join(", ") : "",
      });
      if (userRes && userRes.data) {
        setCurrentUser(userRes.data);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Snippet not found or error loading data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    if (snippet && Prism.plugins.autoloader && !isEditing) {
      Prism.plugins.autoloader.languages_path =
        "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/";
      Prism.highlightAll();
    }
  }, [snippet, isEditing]);

  const handleCopy = async () => {
    if (snippet?.code) {
      try {
        await navigator.clipboard.writeText(snippet.code);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  const formatTimeAgo = (dateString: string) => {
    if (!dateString) return "Just now";
    const now = new Date();
    const past = new Date(dateString);
    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    const elapsed = now.getTime() - past.getTime();
    if (elapsed < msPerMinute) return "Just now";
    if (elapsed < msPerHour) return Math.round(elapsed / msPerMinute) + "m ago";
    if (elapsed < msPerDay) return Math.round(elapsed / msPerHour) + "h ago";
    return past.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleSave = async () => {
    if (!editForm.title.trim() || !editForm.code.trim()) return;
    try {
      setSaveLoading(true);
      const updatedData = await SnippetAPI.update(id!, {
        title: editForm.title,
        description: editForm.description,
        language: editForm.language,
        code: editForm.code,
        tags: editForm.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      });
      setSnippet(updatedData);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update snippet:", err);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleExplainCode = async () => {
    try {
      setAiLoading(true);
      setExplanation("");
      const data = await SnippetAPI.explain(snippet.code, snippet.language);
      setExplanation(data.explanation);
      setAiCooldown(60);
    } catch (err: any) {
      console.error("AI Explanation failed:", err);
      if (err.response?.status === 429) {
        setAiCooldown(60);
      }
    } finally {
      setAiLoading(false);
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleteModalOpen(false);
      setLoading(true);
      await SnippetAPI.delete(id!);
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to delete snippet:", err);
      setLoading(false);
    }
  };

  if (loading)
    return <div className="status-msg">Loading snippet vault...</div>;
  if (error) return <div className="status-msg error">{error}</div>;
  if (!snippet)
    return <div className="status-msg error">Snippet not found.</div>;

  const isOwner = currentUser?.id === snippet?.userId;

  return (
    <div className="snippet-page">
      <div className="snippet-layout">
        <section className="glass-panel">
          {isEditing ? (
            <div className="edit-snippet-form">
              <div className="edit-form-row">
                <div className="edit-form-group flex-1">
                  <label className="edit-form-label">Title</label>
                  <input
                    type="text"
                    className="edit-input-field"
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                  />
                </div>
                <div className="edit-form-group">
                  <label className="edit-form-label">Language</label>
                  <select
                    className="edit-select-field"
                    value={editForm.language}
                    onChange={(e) =>
                      setEditForm({ ...editForm, language: e.target.value })
                    }
                  >
                    <option value="typescript">typescript</option>
                    <option value="javascript">javascript</option>
                    <option value="python">python</option>
                    <option value="yaml">yaml</option>
                    <option value="html">html</option>
                    <option value="css">css</option>
                  </select>
                </div>
              </div>

              <div className="edit-form-group">
                <label className="edit-form-label">Description</label>
                <textarea
                  className="edit-input-field edit-textarea"
                  rows={2}
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                />
              </div>

              <div className="edit-form-group">
                <label className="edit-form-label">
                  Tags (separated by comma)
                </label>
                <input
                  type="text"
                  className="edit-input-field"
                  placeholder="e.g. react, auth, nestjs"
                  value={editForm.tags}
                  onChange={(e) =>
                    setEditForm({ ...editForm, tags: e.target.value })
                  }
                />
              </div>

              <div className="edit-form-group">
                <label className="edit-form-label">Code</label>
                <textarea
                  className="edit-input-field edit-code-area"
                  rows={10}
                  value={editForm.code}
                  onChange={(e) =>
                    setEditForm({ ...editForm, code: e.target.value })
                  }
                />
              </div>
            </div>
          ) : (
            <>
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

              {(aiLoading || explanation) && (
                <div className="ai-explanation-box">
                  <h3 className="ai-explanation-title">
                    <Sparkles size={18} /> AI Code Analysis
                  </h3>
                  {aiLoading ? (
                    <div className="ai-loading-skeleton">
                      <div className="skeleton-line"></div>
                      <div className="skeleton-line short"></div>
                    </div>
                  ) : (
                    <div className="ai-explanation-text">
                      <ReactMarkdown>{explanation}</ReactMarkdown>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </section>

        <aside className="glass-panel sidebar">
          <div className="meta-list">
            <div className="meta-row">
              <span className="meta-icon">
                <Shield size={16} />
              </span>{" "}
              Created By: {snippet.user?.username || "user1"}
            </div>
            <div className="meta-row">
              <span className="meta-icon">
                <Calendar size={16} />
              </span>{" "}
              Created On: {new Date(snippet.createdAt).toLocaleDateString()}
            </div>
            <div className="meta-row">
              <span className="meta-icon">
                <RefreshCw size={16} />
              </span>{" "}
              Last Updated: {formatTimeAgo(snippet.updatedAt)}
            </div>
            <div className="meta-row">
              <span className="meta-icon">
                <Code2 size={16} />
              </span>{" "}
              Downloads: {snippet.downloads || "0"}
            </div>
            <div className="meta-row">
              <span className="meta-icon">
                <Heart size={16} />
              </span>{" "}
              Likes: {snippet.likes || "0"}
            </div>
          </div>

          <div className="divider" />

          {!isEditing && (
            <>
              <div className="tag-cloud">
                {(snippet.tags || ["code"]).map((tag: string) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="divider" />
            </>
          )}

          {!isEditing && (
            <button
              className={`btn btn-ai-explain ${aiCooldown > 0 ? "cooldown-active" : ""}`}
              onClick={handleExplainCode}
              disabled={aiLoading || aiCooldown > 0}
            >
              {aiLoading ? (
                <>
                  <Loader2 size={16} className="spin" /> Analyzing...
                </>
              ) : aiCooldown > 0 ? (
                <>
                  <Hourglass size={16} /> Wait {aiCooldown}s
                </>
              ) : (
                <>
                  <Sparkles size={16} /> Explain with AI
                </>
              )}
            </button>
          )}

          <button
            className="btn btn-copy"
            onClick={handleCopy}
            disabled={isEditing}
          >
            <Copy size={16} /> Copy Code
          </button>

          <button className="btn" onClick={() => {}} disabled={isEditing}>
            <Heart size={16} /> Add to Favorites
          </button>

          <button className="btn" onClick={() => {}} disabled={isEditing}>
            <Share2 size={16} /> Share Snippet
          </button>

          {isOwner && (
            <>
              <div className="divider" />
              {isEditing ? (
                <>
                  <button
                    className="btn btn-edit-snippet"
                    onClick={handleSave}
                    disabled={saveLoading}
                  >
                    {saveLoading ? (
                      <>
                        <Loader2 size={16} className="spin" /> Saving...
                      </>
                    ) : (
                      <>
                        <Check size={16} /> Save Changes
                      </>
                    )}
                  </button>
                  <button
                    className="btn profile-btn-cancel"
                    onClick={() => {
                      setIsEditing(false);
                      setEditForm({
                        title: snippet.title || "",
                        description: snippet.description || "",
                        language: snippet.language || "typescript",
                        code: snippet.code || "",
                        tags: snippet.tags ? snippet.tags.join(", ") : "",
                      });
                    }}
                    disabled={saveLoading}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="btn btn-edit-snippet"
                    onClick={() => setIsEditing(true)}
                  >
                    <Pencil size={16} /> Edit Snippet
                  </button>
                  <button className="btn-report" onClick={handleDeleteClick}>
                    <Trash2 size={16} /> Delete Snippet
                  </button>
                </>
              )}
            </>
          )}
        </aside>
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Snippet"
        message="Are you sure you want to delete this snippet? This action is permanent and cannot be undone."
        confirmText="Yes, Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};

export default SnippetPage;
