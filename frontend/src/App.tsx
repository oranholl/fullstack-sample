import { Routes, Route, Link } from "react-router-dom";
import PokemonListPage from "./pages/PokemonListPage";
import PokemonDetailPage from "./pages/PokemonDetailPage";
import AddPokemonPage from "./pages/AddPokemonPage";

export default function App() {
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <nav className="mb-4 flex gap-4 border-b pb-2">
        <Link to="/">Pokémons</Link>
        <Link to="/add">Add Pokémon</Link>
      </nav>

      <Routes>
        <Route path="/" element={<PokemonListPage />} />
        <Route path="/pokemon/:id" element={<PokemonDetailPage />} />
        <Route path="/add" element={<AddPokemonPage />} />
      </Routes>
    </div>
  );
}
