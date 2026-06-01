import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";

interface RootLayoutProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  onNewSnippetClick: () => void;
}

const RootLayout = ({
  searchQuery,
  setSearchQuery,
  onNewSnippetClick,
}: RootLayoutProps) => {
  return (
    <div className="app-layout">
      <Navbar
        showSearchBar={true}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onNewSnippetClick={onNewSnippetClick}
      />

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
