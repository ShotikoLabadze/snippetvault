import {
  Code2,
  FileText,
  Hourglass,
  Image,
  Loader2,
  Plus,
  Sparkles,
  Tag,
  Terminal,
  Type,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { SnippetAPI } from "../../api/snippets";
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
  const [aiCooldown, setAiCooldown] = useState(0);

  useEffect(() => {
    if (aiCooldown <= 0) return;

    const timer = setInterval(() => {
      setAiCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [aiCooldown]);

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
    if (!code.trim()) return;

    try {
      setAiLoading(true);
      const data = await SnippetAPI.smartFill(code, language);

      const { title: aiTitle, description: aiDescription, tags: aiTags } = data;

      if (aiTitle) setTitle(aiTitle);
      if (aiDescription) setDescription(aiDescription);
      if (aiTags && Array.isArray(aiTags)) {
        setTags(
          aiTags.map((t) => (t.startsWith("#") ? t : `#${t}`)).join(", "),
        );
      }

      setAiCooldown(60);
    } catch (err: any) {
      console.error("AI Smart Fill failed:", err);
      if (err.response?.status === 429) {
        setAiCooldown(60);
      }
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await SnippetAPI.create({
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

  return createPortal(
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" role="dialog" aria-modal="true">
        <div className="modal-header">
          <h2 className="modal-title">
            <Plus size={22} className="title-plus" /> New Snippet
          </h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-row code-row">
            <div className="form-group code-group">
              <div className="code-label-wrapper">
                <label className="form-label">
                  <Code2 size={16} className="label-icon" /> Code
                </label>

                <button
                  type="button"
                  className={`btn-ai-smartfill ${aiCooldown > 0 ? "cooldown-active" : ""}`}
                  onClick={handleSmartFill}
                  disabled={aiLoading || aiCooldown > 0}
                >
                  {aiLoading ? (
                    <>
                      <Loader2 size={12} className="spin" /> Analyzing...
                    </>
                  ) : aiCooldown > 0 ? (
                    <>
                      <Hourglass size={12} /> Wait {aiCooldown}s
                    </>
                  ) : (
                    <>
                      <Sparkles size={12} /> AI Smart Fill
                    </>
                  )}
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
                <Terminal size={16} className="label-icon" /> Language
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
              <Type size={16} className="label-icon" /> Title
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
              <Image size={16} className="label-icon" /> Image URL
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
              <FileText size={16} className="label-icon" /> Description
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
              <Tag size={16} className="label-icon" /> Tags
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
              {loading ? (
                <>
                  <Loader2 size={16} className="spin" /> Saving...
                </>
              ) : (
                "Save Snippet"
              )}
            </button>
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
};

export default CreateSnippetModal;
