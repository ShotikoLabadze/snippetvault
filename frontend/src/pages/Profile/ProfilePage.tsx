import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import CreateSnippetModal from "../../components/CreateModal/CreateSnippetModal";
import Navbar from "../../components/Navbar/Navbar";
import SnippetCard from "../../components/SnippetCard/SnippetCard";
import "./ProfilePage.css";

interface UserProfile {
  username: string;
  email: string;
  createdAt: string;
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mySnippets, setMySnippets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProfileAndSnippets = async () => {
    try {
      setLoading(true);

      const [snippetsRes, userRes] = await Promise.all([
        api.get("/snippets/my-snippets"),
        api.get("/users/me"),
      ]);

      setMySnippets(snippetsRes.data);
      setProfile(userRes.data);
    } catch (err) {
      console.error("Failed to load profile data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndSnippets();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const uniqueLanguagesCount = new Set(
    mySnippets
      .map((snippet) => snippet.language?.toLowerCase())
      .filter(Boolean),
  ).size;

  const totalViewsCount = mySnippets.reduce(
    (sum, snippet) => sum + (snippet.views || 0),
    0,
  );

  const formatJoinedDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  if (loading) {
    return <div className="profile-loading">Accessing Your Vault...</div>;
  }

  return (
    <div className="profile-page-container">
      <Navbar
        showSearchBar={false}
        onNewSnippetClick={() => setIsModalOpen(true)}
      />

      <main className="profile-layout">
        <section className="profile-hero-card glass-panel">
          <div className="profile-hero-left">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
              alt={profile?.username}
              className="profile-avatar"
            />
            <div className="hero-text-details">
              <h1 className="profile-username">{profile?.username}</h1>
              <p className="profile-fullname">John D.</p>
              <p className="profile-bio">Software Engineer & Code Hoarder</p>
              <p className="profile-joined">
                Joined: {formatJoinedDate(profile?.createdAt)}
              </p>
            </div>
          </div>

          <div className="profile-actions">
            <button className="profile-btn btn-profile-edit">
              Edit Profile
            </button>
            <button className="profile-btn btn-profile-password">
              Change Password
            </button>
            <button
              className="profile-btn btn-profile-logout"
              onClick={handleLogout}
            >
              Logout 🚪
            </button>
          </div>
        </section>

        <section className="profile-stats-row">
          <div className="stat-card glass-panel">
            <span className="stat-icon">{"</>"}</span>
            <div className="stat-info">
              <span className="stat-label">Total Snippets</span>
              <span className="stat-value">{mySnippets.length}</span>
            </div>
          </div>

          <div className="stat-card glass-panel">
            <span className="stat-icon">👁</span>
            <div className="stat-info">
              <span className="stat-label">Total Views</span>
              <span className="stat-value">{totalViewsCount}</span>
            </div>
          </div>

          <div className="stat-card glass-panel">
            <span className="stat-icon">⚙️</span>
            <div className="stat-info">
              <span className="stat-label">Used Languages</span>
              <span className="stat-value">{uniqueLanguagesCount}</span>
            </div>
          </div>

          <div className="stat-card glass-panel">
            <span className="stat-icon">🏷</span>
            <div className="stat-info">
              <span className="stat-label">Top Tag</span>
              <span className="stat-value stat-value-tag">#nestjs</span>
            </div>
          </div>
        </section>

        <div className="profile-bottom-section">
          <section className="profile-snippets-grid-wrapper">
            <h2 className="section-title">Your Pinned Snippets</h2>
            {mySnippets.length === 0 ? (
              <p className="empty-vault">
                Your vault is empty. Create your first snippet!
              </p>
            ) : (
              <div className="profile-snippets-grid">
                {mySnippets.map((snippet) => (
                  <SnippetCard key={snippet.id} snippet={snippet} />
                ))}
              </div>
            )}
          </section>

          <aside className="recent-activity-panel glass-panel">
            <h2 className="section-title">Recent Activity</h2>
            <div className="activity-timeline">
              <div className="activity-item">
                <span className="activity-icon activity-icon-sync">🔄</span>
                <div className="activity-content">
                  <p className="activity-text">
                    Updated: <strong>JWT Auth Guard</strong>
                  </p>
                  <span className="activity-time">2h ago</span>
                </div>
              </div>

              <div className="activity-item">
                <span className="activity-icon activity-icon-create">📝</span>
                <div className="activity-content">
                  <p className="activity-text">
                    Created: <strong>Neon Button</strong>
                  </p>
                  <span className="activity-time">5h ago</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <CreateSnippetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSnippetCreated={fetchProfileAndSnippets}
      />
    </div>
  );
};

export default ProfilePage;
