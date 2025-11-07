import { useMutation } from "@apollo/client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormField from "../components/FormField";
import TypeBadge from "../components/TypeBadge";
import { ADD_POKEMON } from "../graphql/queries";
import { POKEMON_TYPES } from "../constants/pokemon";
import { useRequireAuth } from "../hooks/useAuth";

export default function AddPokemonPage() {
  const [form, setForm] = useState({
    name: "",
    height: "",
    weight: "",
    imageUrl: "",
    category: "",
    description: "",
  });
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedWeaknesses, setSelectedWeaknesses] = useState<string[]>([]);
  const [abilities, setAbilities] = useState("");

  const [addPokemon] = useMutation(ADD_POKEMON);
  const navigate = useNavigate();
  const { token } = useRequireAuth();

  const toggleType = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleWeakness = (type: string) => {
    setSelectedWeaknesses(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (selectedTypes.length === 0) {
      alert("Please select at least one type");
      return;
    }

    try {
      await addPokemon({
        variables: {
          token,
          name: form.name,
          height: Number(form.height),
          weight: Number(form.weight),
          imageUrl: form.imageUrl || null,
          types: selectedTypes,
          weaknesses: selectedWeaknesses,
          abilities: abilities ? abilities.split(",").map(a => a.trim()) : [],
          category: form.category || null,
          description: form.description || null,
        },
      });
      navigate("/");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="content-wrapper">
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "600", marginBottom: "2rem" }}>
          Add Pokémon
        </h1>

        <form onSubmit={handleSubmit} className="login-form">
          <FormField label="Name" required>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="form-input"
              placeholder="e.g., Pikachu"
            />
          </FormField>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <FormField label="Height (cm)" required>
              <input
                type="number"
                value={form.height}
                onChange={(e) => setForm({ ...form, height: e.target.value })}
                required
                className="form-input"
                placeholder="e.g., 40"
              />
            </FormField>

            <FormField label="Weight (kg)" required>
              <input
                type="number"
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: e.target.value })}
                required
                className="form-input"
                placeholder="e.g., 6"
              />
            </FormField>
          </div>

          <FormField label="Category">
            <input
              type="text"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="form-input"
              placeholder="e.g., Mouse"
            />
          </FormField>

          <FormField label="Image URL">
            <input
              type="text"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              className="form-input"
              placeholder="https://..."
            />
          </FormField>

          <FormField label="Types (select at least one)" required>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.5rem" }}>
              {POKEMON_TYPES.map(type => (
                <TypeBadge
                  key={type}
                  type={type}
                  onClick={() => toggleType(type)}
                  isSelected={selectedTypes.includes(type)}
                />
              ))}
            </div>
          </FormField>

          <FormField label="Weaknesses (optional)">
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.5rem" }}>
              {POKEMON_TYPES.map(type => (
                <TypeBadge
                  key={type}
                  type={type}
                  onClick={() => toggleWeakness(type)}
                  isSelected={selectedWeaknesses.includes(type)}
                />
              ))}
            </div>
          </FormField>

          <FormField label="Abilities (comma-separated)">
            <input
              type="text"
              value={abilities}
              onChange={(e) => setAbilities(e.target.value)}
              className="form-input"
              placeholder="e.g., Static, Lightning Rod"
            />
          </FormField>

          <FormField label="Description">
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="form-input"
              rows={4}
              placeholder="Enter a description..."
              style={{ resize: "vertical" }}
            />
          </FormField>

          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <button type="submit" className="form-button">
              Save Pokémon
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
