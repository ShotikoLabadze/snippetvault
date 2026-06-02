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

  return (
    <header className="navbar">
      <div
        className="logo"
        onClick={() => navigate("/dashboard")}
        style={{ cursor: "pointer" }}
      >
        <div className="logo-mark">
          <img src={logo} alt="Logo" />
        </div>
        <h1 className="auth-brand-name">
          Snippet<span>Vault</span>
        </h1>
      </div>

      {showSearchBar ? (
        <input
          type="text"
          className="search-bar"
          placeholder="Search Your Vault..."
          value={searchQuery}
          onChange={(e) => setSearchQuery?.(e.target.value)}
        />
      ) : (
        <div className="search-placeholder" />
      )}

      <div className="header-actions">
        <div className="profile-trigger" onClick={() => navigate("/profile")}>
          <img src="" alt="" className="user-avatar" />
          <span className="profile-text">Profile ▾</span>
        </div>

        <button className="btn-new-snippet" onClick={onNewSnippetClick}>
          + New Snippet
        </button>
      </div>
    </header>
  );
};

export default Navbar;
