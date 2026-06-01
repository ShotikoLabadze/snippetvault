import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";

interface RootLayoutProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

const RootLayout = ({ searchQuery, setSearchQuery }: RootLayoutProps) => {
  return (
    <div className="app-layout">
      <Navbar
        showSearchBar={true}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
