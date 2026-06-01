import { useState } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import "./App.css";
import CreateSnippetModal from "./components/CreateModal/CreateSnippetModal";
import RootLayout from "./Layouts/RootLayout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ProfilePage from "./pages/Profile/ProfilePage";
import Register from "./pages/Register";
import SnippetPage from "./pages/SnippetPage/SnippetPage";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSnippetCreated = () => {
    setIsModalOpen(false);

    window.location.reload();
  };

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route
          element={
            <RootLayout
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onNewSnippetClick={() => setIsModalOpen(true)}
            />
          }
        >
          <Route
            path="/dashboard"
            element={<Dashboard searchQuery={searchQuery} />}
          />
          <Route path="/snippets/:id" element={<SnippetPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>

      <CreateSnippetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSnippetCreated={handleSnippetCreated}
      />
    </Router>
  );
}

export default App;
