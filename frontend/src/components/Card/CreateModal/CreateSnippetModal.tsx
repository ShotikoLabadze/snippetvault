import { useState } from "react";
import api from "../../../api/axios";
import "./CreateSnippetModal.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSnippetCreated: () => void;
}

const CreateSnippetModal = ({
  isOpen,
  onClose,
  onSnippetCreated,
}: ModalProps) => {
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !code) return alert("Title and Code fields are required!");

    setLoading(true);
    try {
      const tagsArray = tags ? tags.split(",").map((t) => t.trim()) : [];
      await api.post("/snippets", {
        title,
        language,
        code,
        description,
        tags: tagsArray,
      });

      setTitle("");
      setCode("");
      setDescription("");
      setTags("");
      onSnippetCreated();
      onClose();
    } catch (err) {
      console.error("Error creating snippet:", err);
      alert("Failed to create snippet. Make sure you are logged in!");
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">
            <span className="modal-title-plus">+</span> Create New Snippet
          </h2>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              className="form-input"
              type="text"
              placeholder="e.g., Axios Auth Interceptor"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Language</label>
              <select
                className="form-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="sql">SQL</option>
                <option value="yaml">YAML</option>
                <option value="bash">Bash</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Tags (comma separated)</label>
              <input
                className="form-input"
                type="text"
                placeholder="auth, security, nestjs"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              placeholder="What does this snippet do?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Code</label>
            <textarea
              className="form-textarea code-input"
              placeholder="Paste your snippet code here..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Saving..." : "Save to Vault"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSnippetModal;
