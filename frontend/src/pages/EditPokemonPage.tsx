import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FormField from "../components/FormField";
import { GET_POKEMON, UPDATE_POKEMON } from "../graphql/queries";
import { useRequireAuth } from "../hooks/useAuth";

export default function EditPokemonPage() {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState({ name: "", height: "", weight: "", imageUrl: "" });
  const [updatePokemon] = useMutation(UPDATE_POKEMON);
  const navigate = useNavigate();
  const { token } = useRequireAuth();

  const { data, loading } = useQuery(GET_POKEMON, {
    variables: { id },
    onCompleted: (data) => {
      if (data.pokemon) {
        setForm({
          name: data.pokemon.name,
          height: data.pokemon.height.toString(),
          weight: data.pokemon.weight.toString(),
          imageUrl: data.pokemon.imageUrl || "",
        });
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      await updatePokemon({
        variables: {
          token,
          id,
          name: form.name,
          height: Number(form.height),
          weight: Number(form.weight),
          imageUrl: form.imageUrl || null,
        },
      });
      navigate("/");
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <div className="content-wrapper"><p>Loading...</p></div>;
  if (!data?.pokemon) return <div className="content-wrapper"><p>Pokémon not found</p></div>;

  return (
    <div className="content-wrapper">
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "600", marginBottom: "2rem" }}>
          Edit Pokémon
        </h1>

        <form onSubmit={handleSubmit} className="login-form">
          <FormField label="Name" required>
            <input
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="form-input"
            />
          </FormField>

          <FormField label="Height (cm)" required>
            <input
              type="number"
              placeholder="Height"
              value={form.height}
              onChange={(e) => setForm({ ...form, height: e.target.value })}
              required
              className="form-input"
            />
          </FormField>

          <FormField label="Weight (kg)" required>
            <input
              type="number"
              placeholder="Weight"
              value={form.weight}
              onChange={(e) => setForm({ ...form, weight: e.target.value })}
              required
              className="form-input"
            />
          </FormField>

          <FormField label="Image URL">
            <input
              type="text"
              placeholder="Image URL"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              className="form-input"
            />
          </FormField>

          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <button type="submit" className="form-button">
              Update
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="form-button"
              style={{ backgroundColor: "#6b7280" }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
