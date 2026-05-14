import { useEffect, useState } from "react";
import api from "../api/axios";
import SnippetCard from "../api/components/Card/SnippetCard";

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

  if (loading) return <p>Loading vault...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>My Snippet Vault</h1>

      {snippets.length === 0 ? (
        <p>Your vault is empty! We will add a form next.</p>
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
