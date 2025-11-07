import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ADD_POKEMON = gql`
  mutation AddPokemon($name: String!, $height: Int!, $weight: Int!, $imageUrl: String) {
    addPokemon(name: $name, height: $height, weight: $weight, imageUrl: $imageUrl) {
      id
      name
    }
  }
`;

export default function AddPokemonPage() {
  const [form, setForm] = useState({ name: "", height: "", weight: "", imageUrl: "" });
  const [addPokemon] = useMutation(ADD_POKEMON);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addPokemon({
      variables: {
        name: form.name,
        height: Number(form.height),
        weight: Number(form.weight),
        imageUrl: form.imageUrl,
      },
    });
    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-sm">
      <h1 className="text-xl mb-2">Add Pokémon</h1>

      <input
        type="text"
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
        className="border p-2 rounded"
      />

      <input
        type="number"
        placeholder="Height"
        value={form.height}
        onChange={(e) => setForm({ ...form, height: e.target.value })}
        required
        className="border p-2 rounded"
      />

      <input
        type="number"
        placeholder="Weight"
        value={form.weight}
        onChange={(e) => setForm({ ...form, weight: e.target.value })}
        required
        className="border p-2 rounded"
      />

      <input
        type="text"
        placeholder="Image URL"
        value={form.imageUrl}
        onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
        className="border p-2 rounded"
      />

      <button
        type="submit"
        className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
      >
        Save
      </button>
    </form>
  );
}
