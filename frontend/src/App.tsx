import { Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";
import PokemonListPage from "./pages/PokemonListPage";
import PokemonDetailPage from "./pages/PokemonDetailPage";
import AddPokemonPage from "./pages/AddPokemonPage";
import EditPokemonPage from "./pages/EditPokemonPage";
import LoginPage from "./pages/LoginPage";
import { useAuth, useLogout } from "./hooks/useAuth";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { username, isAuthenticated } = useAuth();
  const logout = useLogout();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      if (/^\d+$/.test(searchQuery.trim())) {
        navigate(`/pokemon/${searchQuery.trim()}`);
      } else {
        navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      }
    } else {
      navigate("/");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div>
      <header className="app-header">
        <h1 className="app-title">Pokédex</h1>
      </header>

      <nav className="app-nav">
        <div className="nav-content">
          <div className="nav-top">
            <div className="search-section">
              <label className="search-label">Name or Number</label>
              <div className="search-box">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search Pokémon..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button className="search-button" onClick={handleSearch}>
                  Search
                </button>
              </div>
              <p className="advanced-search-text">
                Use the Advanced Search to explore Pokémon by type, weakness, Ability, and more!
              </p>
            </div>

            <div className="info-box">
              <p>
                Search for a Pokémon by name or using its National Pokédex number.
              </p>
            </div>
          </div>

          <div className="nav-bottom">
            <div className="auth-section">
              {isAuthenticated ? (
                <>
                  <span className="auth-username">Welcome, <strong>{username}</strong></span>
                  <button onClick={logout} className="auth-button">
                    Logout
                  </button>
                </>
              ) : (
                <button onClick={() => navigate("/login")} className="auth-button login-button">
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<PokemonListPage />} />
          <Route path="/pokemon/:id" element={<PokemonDetailPage />} />
          <Route path="/add" element={<AddPokemonPage />} />
          <Route path="/edit/:id" element={<EditPokemonPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>
    </div>
  );
}