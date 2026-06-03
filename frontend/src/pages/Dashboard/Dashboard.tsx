import { useEffect, useState } from "react";
import { SnippetAPI } from "../../api/snippets";
import CreateSnippetModal from "../../components/CreateModal/CreateSnippetModal";
import SnippetCard from "../../components/SnippetCard/SnippetCard";
import "./Dashboard.css";

interface DashboardProps {
  searchQuery: string;
}

const Dashboard = ({ searchQuery }: DashboardProps) => {
  const [snippets, setSnippets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchSnippets = async () => {
    try {
      setLoading(true);
      const snippetData = await SnippetAPI.getAll();
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

  if (loading) {
    return <div className="status-msg">Loading vault...</div>;
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1 className="dashboard-title">My Snippet Vault</h1>
      </div>

      {filteredSnippets.length === 0 ? (
        <p className="empty-vault-msg">
          {searchQuery ? "No matching snippets found!" : "Your vault is empty!"}
        </p>
      ) : (
        <ul className="masonry-grid">
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
