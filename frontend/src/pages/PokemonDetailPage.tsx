import { useQuery } from "@apollo/client";
import { useParams, Link } from "react-router-dom";
import TypeBadge from "../components/TypeBadge";
import { GET_POKEMON, CHECK_POKEMON_EXISTS } from "../graphql/queries";
import { cmToFeetInches, kgToLbs, formatPokedexNumber } from "../utils/conversions";

export default function PokemonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useQuery(GET_POKEMON, {
    variables: { id },
  });

  const currentNum = parseInt(id!);
  
  const { data: prevData } = useQuery(CHECK_POKEMON_EXISTS, {
    variables: { id: String(currentNum - 1) },
    skip: currentNum <= 1,
  });
  
  const { data: nextData } = useQuery(CHECK_POKEMON_EXISTS, {
    variables: { id: String(currentNum + 1) },
  });

  if (loading) return <div className="detail-container"><p>Loading...</p></div>;
  if (error) return <div className="detail-container"><p>Error: {error.message}</p></div>;
  if (!data?.pokemon) return <div className="detail-container"><p>Pokémon not found</p></div>;

  const pokemon = data.pokemon;
  const displayNumber = pokemon.pokedexNumber || id;
  const hasPrevious = currentNum > 1 && prevData?.pokemon;
  const hasNext = !!nextData?.pokemon;

  return (
    <div className="detail-container">
      <div className="detail-navigation">
        <Link to="/" className="nav-link">
          ← Back to List
        </Link>
        <div style={{ display: "flex", gap: "1rem" }}>
          {hasPrevious ? (
            <Link to={`/pokemon/${currentNum - 1}`} className="nav-link">
              ← Previous
            </Link>
          ) : (
            <button className="nav-link" disabled style={{ opacity: 0.4, cursor: "not-allowed" }}>
              ← Previous
            </button>
          )}
          {hasNext ? (
            <Link to={`/pokemon/${currentNum + 1}`} className="nav-link">
              Next →
            </Link>
          ) : (
            <button className="nav-link" disabled style={{ opacity: 0.4, cursor: "not-allowed" }}>
              Next →
            </button>
          )}
        </div>
      </div>

      <div className="detail-card">
        <div className="detail-header">
          <h1 className="detail-title">
            {pokemon.name}{" "}
            <span className="detail-subtitle">
              #{formatPokedexNumber(displayNumber)}
            </span>
          </h1>
        </div>

        <div className="detail-content">
          <div className="detail-image-section">
            {pokemon.imageUrl ? (
              <img src={pokemon.imageUrl} alt={pokemon.name} className="detail-image" />
            ) : (
              <div style={{ width: "300px", height: "300px", backgroundColor: "#e5e7eb", borderRadius: "12px" }} />
            )}
          </div>

          <div className="detail-info-section">
            {pokemon.description && (
              <p className="info-description">
                {pokemon.description}
              </p>
            )}

            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Height</span>
                <span className="info-value">{cmToFeetInches(pokemon.height)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Category</span>
                <span className="info-value">{pokemon.category || "Unknown"}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Weight</span>
                <span className="info-value">{kgToLbs(pokemon.weight)} lbs</span>
              </div>
              <div className="info-item">
                <span className="info-label">Abilities</span>
                <span className="info-value">
                  {pokemon.abilities.length > 0 ? pokemon.abilities.join(", ") : "None"}
                </span>
              </div>
            </div>

            <div>
              <h3 style={{ marginBottom: "1rem", fontWeight: "600" }}>Type</h3>
              <div className="pokemon-types">
                {pokemon.types.map((type: string) => (
                  <TypeBadge key={type} type={type} />
                ))}
              </div>
            </div>

            {pokemon.weaknesses.length > 0 && (
              <div>
                <h3 style={{ marginBottom: "1rem", fontWeight: "600" }}>Weaknesses</h3>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {pokemon.weaknesses.map((weakness: string) => (
                    <TypeBadge key={weakness} type={weakness} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}