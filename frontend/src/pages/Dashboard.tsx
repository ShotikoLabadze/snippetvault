import { useEffect, useState } from "react";
import api from "../api/axios";
import CreateSnippetModal from "../components/CreateModal/CreateSnippetModal";
import SnippetCard from "../components/SnippetCard/SnippetCard";

interface DashboardProps {
  searchQuery: string;
}

const Dashboard = ({ searchQuery }: DashboardProps) => {
  const [snippets, setSnippets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchSnippets = async () => {
    try {
      const response = await api.get("/snippets");
      const snippetData = response.data.data || response.data;
      setSnippets(snippetData);
    } catch (err) {
      console.error("Error fetching snippets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSnippets();
  }, []);

  const filteredSnippets = snippets.filter(
    (snippet) =>
      snippet.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.language?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading)
    return <p style={{ padding: 20, color: "#fff" }}>Loading vault...</p>;

  return (
    <div className="dashboard-page">
      <div
        className="dashboard-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "32px 48px 12px",
        }}
      >
        <h1 className="dashboard-title" style={{ margin: 0, padding: 0 }}>
          My Snippet Vault
        </h1>
      </div>

      {filteredSnippets.length === 0 ? (
        <p style={{ color: "#cfeaff", padding: "0 48px" }}>
          {searchQuery ? "No matching snippets found!" : "Your vault is empty!"}
        </p>
      ) : (
        <ul className="masonry-grid" style={{ padding: "20px 48px" }}>
          {filteredSnippets.map((snippet) => (
            <li key={snippet.id} className="masonry-item">
              <SnippetCard snippet={snippet} />
            </li>
          ))}
        </ul>
      )}

      <CreateSnippetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSnippetCreated={fetchSnippets}
      />
    </div>
  );
};

export default Dashboard;
