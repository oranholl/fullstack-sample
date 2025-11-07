import { useParams } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";

const GET_POKEMON = gql`
  query Pokemon($id: ID!) {
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
  const { id } = useParams();
  const { data, loading, error } = useQuery(GET_POKEMON, {
    variables: { id },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data?.pokemon) return <p>Pokémon not found.</p>;

  const { name, height, weight, imageUrl } = data.pokemon;

  return (
    <div>
      <h1 className="text-2xl mb-2">{name}</h1>
      {imageUrl && <img src={imageUrl} alt={name} className="mb-2 w-32" />}
      <p>Height: {height} cm</p>
      <p>Weight: {weight} kg</p>
    </div>
  );
}
