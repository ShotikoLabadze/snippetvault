import { useState } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import "./App.css";
import RootLayout from "./Layouts/RootLayout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ProfilePage from "./pages/Profile/ProfilePage";
import Register from "./pages/Register";
import SnippetPage from "./pages/SnippetPage/SnippetPage";

function App() {
  const [searchQuery, setSearchQuery] = useState("");

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
    </Router>
  );
}

export default App;
