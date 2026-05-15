import { useEffect, useState } from "react";
import api from "../api/axios";
import SnippetCard from "../Card/SnippetCard";

const Dashboard = () => {
  const [snippets, setSnippets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading)
    return <p style={{ padding: 20, color: "#fff" }}>Loading vault...</p>;

  return (
    <div className="dashboard-page">
      <h1 className="dashboard-title">My Snippet Vault</h1>
      {snippets.length === 0 ? (
        <p style={{ color: "#cfeaff" }}>
          Your vault is empty! We will add a form next.
        </p>
      ) : (
        <ul className="masonry-grid">
          {snippets.map((snippet) => (
            <li key={snippet._id} className="masonry-item">
              <SnippetCard snippet={snippet} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
