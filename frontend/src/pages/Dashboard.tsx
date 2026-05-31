import { useEffect, useState } from "react";
import api from "../api/axios";
import CreateSnippetModal from "../components/CreateModal/CreateSnippetModal";
import Navbar from "../components/Navbar/Navbar";
import SnippetCard from "../components/SnippetCard/SnippetCard";

const Dashboard = () => {
  const [snippets, setSnippets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
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
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onNewSnippetClick={() => setIsModalOpen(true)}
      />

      <h1 className="dashboard-title" style={{ padding: "20px 48px 0" }}>
        My Snippet Vault
      </h1>

      {filteredSnippets.length === 0 ? (
        <p style={{ color: "#cfeaff", padding: "0 48px" }}>
          {searchQuery ? "No matching snippets found!" : "Your vault is empty!"}
        </p>
      ) : (
        <ul className="masonry-grid" style={{ padding: "20px 48px" }}>
          {filteredSnippets.map((snippet) => (
            <li key={snippet._id} className="masonry-item">
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
