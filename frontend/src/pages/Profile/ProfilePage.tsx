import { useEffect, useState } from "react";
import api from "../../api/axios";
import CreateSnippetModal from "../../components/CreateModal/CreateSnippetModal";
import Navbar from "../../components/Navbar/Navbar";
import SnippetCard from "../../components/SnippetCard/SnippetCard";
import "./ProfilePage.css";

interface UserProfile {
  username: string;
  email: string;
  avatarUrl?: string;
  joinedDate?: string;
  totalViews?: number;
  topTag?: string;
}

const ProfilePage = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mySnippets, setMySnippets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProfileAndSnippets = async () => {
    try {
      setLoading(true);

      const snippetsResponse = await api.get("/snippets/my-snippets");
      setMySnippets(snippetsResponse.data);

      setProfile({
        username: "JohnDoe",
        email: "john@snippetvault.com",
        avatarUrl:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
        joinedDate: "May 2024",
        totalViews: 1500,
        topTag: "#nestjs",
      });
    } catch (err) {
      console.error("Failed to load profile data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndSnippets();
  }, []);

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
          <div className="hero-main-info">
            <img
              src={profile?.avatarUrl}
              alt={profile?.username}
              className="hero-avatar"
            />
            <div className="hero-text-details">
              <h1 className="hero-username">{profile?.username}</h1>
              <p className="hero-fullname">John D.</p>
              <p className="hero-bio">Software Engineer & Code Hoarder</p>
              <p className="hero-joined">Joined: {profile?.joinedDate}</p>
            </div>
          </div>

          <div className="hero-actions-buttons">
            <button className="btn-profile-edit">Edit Profile</button>
            <button className="btn-profile-password">Change Password</button>
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
              <span className="stat-value">1.5k</span>
            </div>
          </div>

          <div className="stat-card glass-panel">
            <span className="stat-icon">{}</span>
            <div className="stat-info">
              <span className="stat-label">Used Languages</span>
              <span className="stat-value">12</span>
            </div>
          </div>

          <div className="stat-card glass-panel">
            <span className="stat-icon">🏷</span>
            <div className="stat-info">
              <span className="stat-label">Top Tag</span>
              <span className="stat-value-tag">{profile?.topTag}</span>
            </div>
          </div>
        </section>

        <div className="profile-bottom-section">
          <section className="pinned-snippets-zone">
            <h2 className="section-title">Your Pinned Snippets</h2>
            {mySnippets.length === 0 ? (
              <p className="no-snippets-msg">
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
            <h2 className="activity-title">Recent Activity</h2>
            <div className="activity-timeline">
              <div className="activity-item">
                <span className="activity-icon-sync">🔄</span>
                <div>
                  <p>
                    Updated: <strong>JWT Auth Guard</strong>
                  </p>
                  <span className="activity-time">2h ago</span>
                </div>
              </div>

              <div className="activity-item">
                <span className="activity-icon-edit">📝</span>
                <div>
                  <p>
                    Created: <strong>Neon Button</strong>
                  </p>
                  <span className="activity-time">5h ago</span>
                </div>
              </div>

              <div className="activity-item">
                <span className="activity-icon-tag">🏷</span>
                <div>
                  <p>
                    Added Tag: <span className="text-neon-cyan">#docker</span>{" "}
                    to Deno Basics
                  </p>
                  <span className="activity-time">1d ago</span>
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
