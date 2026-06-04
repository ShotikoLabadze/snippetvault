import { ChevronDown, Plus, Search, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import "./Navbar.css";

interface NavbarProps {
  searchQuery?: string;
  setSearchQuery?: (value: string) => void;
  showSearchBar?: boolean;
  onNewSnippetClick?: () => void;
}

const Navbar = ({
  searchQuery = "",
  setSearchQuery,
  showSearchBar = true,
  onNewSnippetClick,
}: NavbarProps) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className={`navbar ${isOpen ? "is-open" : ""}`}>
      <div
        className="logo"
        onClick={() => {
          navigate("/dashboard");
          closeMenu();
        }}
        style={{ cursor: "pointer" }}
      >
        <div className="logo-mark">
          <img src={logo} alt="Logo" />
        </div>
        <h1 className="auth-brand-name">
          Snippet<span>Vault</span>
        </h1>
      </div>

      <button
        className="nav-toggle"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>

      <div className="nav-collapse">
        {showSearchBar ? (
          <div className="search-wrapper">
            <Search size={18} className="search-icon-inside" />
            <input
              type="text"
              className="search-bar"
              placeholder="Search Your Vault..."
              value={searchQuery}
              onChange={(e) => setSearchQuery?.(e.target.value)}
            />
          </div>
        ) : (
          <div className="search-placeholder" />
        )}

        <div className="header-actions">
          <div
            className="profile-trigger"
            onClick={() => {
              navigate("/profile");
              closeMenu();
            }}
          >
            <div className="avatar-wrapper">
              <User size={16} className="default-avatar-icon" />
            </div>
            <span className="profile-text">Profile</span>
            <ChevronDown size={14} className="chevron-icon" />
          </div>

          <button
            className="btn-new-snippet"
            onClick={() => {
              onNewSnippetClick?.();
              closeMenu();
            }}
          >
            <Plus size={16} />
            <span>New Snippet</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
