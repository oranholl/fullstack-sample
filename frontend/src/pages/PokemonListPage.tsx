import { useQuery, gql } from "@apollo/client";
import { Link } from "react-router-dom";

const GET_POKEMONS = gql`
  query {
    pokemons {
      id
      name
      height
      weight
    }
  }
`;

export default function PokemonListPage() {
  const { data, loading, error } = useQuery(GET_POKEMONS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1 className="text-xl mb-4">Pokémons</h1>
      <ul className="space-y-2">
        {data.pokemons.map((p: any) => (
          <li key={p.id} className="border p-2 rounded">
            <Link to={`/pokemon/${p.id}`}>
              <strong>{p.name}</strong> — {p.height} cm / {p.weight} kg
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
