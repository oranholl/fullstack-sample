import { useQuery, gql } from "@apollo/client";
import { useParams, Link } from "react-router-dom";

const GET_POKEMON = gql`
  query GetPokemon($id: ID!) {
    pokemon(id: $id) {
      id
      name
      height
      weight
      imageUrl
    }
  }
`;

export default function PokemonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useQuery(GET_POKEMON, {
    variables: { id },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data?.pokemon) return <p>Pokémon not found</p>;

  const pokemon = data.pokemon;

  return (
    <div className="max-w-2xl">
      <Link to="/" className="text-blue-500 hover:underline mb-4 inline-block">
        ← Back to list
      </Link>

      <div className="border rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-4">{pokemon.name}</h1>

        {pokemon.imageUrl && (
          <img
            src={pokemon.imageUrl}
            alt={pokemon.name}
            className="w-48 h-48 mx-auto mb-4"
          />
        )}

        <div className="space-y-2">
          <p>
            <strong>Height:</strong> {pokemon.height} cm
          </p>
          <p>
            <strong>Weight:</strong> {pokemon.weight} kg
          </p>
        </div>
      </div>
    </div>
  );
}