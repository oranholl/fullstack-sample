import { Link } from "react-router-dom";
import TypeBadge from "./TypeBadge";

interface PokemonCardProps {
  pokemon: {
    id: string;
    pokedexNumber?: number;
    name: string;
    imageUrl?: string;
    types: string[];
  };
  isAuthenticated: boolean;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

export default function PokemonCard({ pokemon, isAuthenticated, onDelete }: PokemonCardProps) {
  const displayNumber = pokemon.pokedexNumber || pokemon.id;

  return (
    <Link
      to={`/pokemon/${displayNumber}`}
      className="pokemon-card"
    >
      <div className="pokemon-image-container">
        {pokemon.imageUrl ? (
          <img src={pokemon.imageUrl} alt={pokemon.name} className="pokemon-image" />
        ) : (
          <div style={{ width: "120px", height: "120px", backgroundColor: "#e5e7eb", borderRadius: "8px" }} />
        )}
      </div>
      <div className="pokemon-number">#{displayNumber.toString().padStart(4, "0")}</div>
      <div className="pokemon-name">{pokemon.name}</div>
      <div className="pokemon-types">
        {pokemon.types.map((type: string) => (
          <TypeBadge key={type} type={type} />
        ))}
      </div>

      {isAuthenticated && (
        <div className="pokemon-actions">
          <Link
            to={`/edit/${displayNumber}`}
            className="action-link"
            onClick={(e) => e.stopPropagation()}
          >
            Edit
          </Link>
          <button
            onClick={(e) => onDelete(pokemon.id, e)}
            className="action-button"
          >
            Delete
          </button>
        </div>
      )}
    </Link>
  );
}
