import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import api from "../../api/axios";
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
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("typescript");
  const [code, setCode] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSmartFill = async () => {
    if (!code.trim()) {
      alert("Please paste some code first!");
      return;
    }

    try {
      setAiLoading(true);

      const response = await api.post("/ai/smart-fill", { code, language });

      const {
        title: aiTitle,
        description: aiDescription,
        tags: aiTags,
      } = response.data;

      if (aiTitle) setTitle(aiTitle);
      if (aiDescription) setDescription(aiDescription);
      if (aiTags && Array.isArray(aiTags)) {
        setTags(
          aiTags.map((t) => (t.startsWith("#") ? t : `#${t}`)).join(", "),
        );
      }
    } catch (err) {
      console.error("AI Smart Fill failed:", err);
      alert("AI was unable to process the code. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/snippets", {
        title,
        imageUrl,
        description,
        language,
        code,
        tags: tags
          .split(",")
          .map((t) => t.trim().replace("#", ""))
          .filter(Boolean),
      });
      onSnippetCreated();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const modal = (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" role="dialog" aria-modal="true">
        <div className="modal-header">
          <h2 className="modal-title">
            <span className="title-plus">+</span> New Snippet
          </h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-row code-row">
            <div className="form-group code-group">
              <div className="code-label-wrapper">
                <label className="form-label">
                  <span className="label-icon">{`</>`}</span> Code
                </label>

                <button
                  type="button"
                  className="btn-ai-smartfill"
                  onClick={handleSmartFill}
                  disabled={aiLoading}
                >
                  {aiLoading ? "✨ Analyzing..." : "✨ AI Smart Fill"}
                </button>
              </div>
              <textarea
                className="form-textarea code-input"
                placeholder="/* paste your code here first, then press AI Smart Fill */"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>

            <div className="form-group lang-group">
              <label className="form-label">
                <span className="label-icon">⌘</span> Language
              </label>
              <select
                className="form-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
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

          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">🛡</span> Title
            </label>
            <input
              className="form-input"
              type="text"
              placeholder="e.g., Modern Neon Button (or use AI Smart Fill)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">🖼</span> Image URL
            </label>
            <input
              className="form-input"
              type="url"
              placeholder="https://example.com/snippet-preview.png"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">✎</span> Description
            </label>
            <textarea
              className="form-textarea"
              placeholder="Briefly describe what this snippet does..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">🏷</span> Tags
            </label>
            <input
              className="form-input tags-input"
              type="text"
              placeholder="#auth, #nestjs, #docker"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          <div className="modal-actions">
            <button
              type="submit"
              className="btn-submit"
              disabled={loading || aiLoading}
            >
              {loading ? "Saving..." : "Save Snippet"}
            </button>
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

export default CreateSnippetModal;
