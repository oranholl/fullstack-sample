// All Pokemon types
export const POKEMON_TYPES = [
  "Normal",
  "Fire",
  "Water",
  "Electric",
  "Grass",
  "Ice",
  "Fighting",
  "Poison",
  "Ground",
  "Flying",
  "Psychic",
  "Bug",
  "Rock",
  "Ghost",
  "Dragon",
  "Dark",
  "Steel",
  "Fairy",
] as const;

export type PokemonType = typeof POKEMON_TYPES[number];

// Sort options for the dropdown
export const SORT_OPTIONS = [
  { value: "NAME_ASC", label: "Lowest Number (First)" },
  { value: "NAME_DESC", label: "Highest Number (First)" },
  { value: "HEIGHT_ASC", label: "Shortest" },
  { value: "HEIGHT_DESC", label: "Tallest" },
  { value: "WEIGHT_ASC", label: "Lightest" },
  { value: "WEIGHT_DESC", label: "Heaviest" },
] as const;

// Page size options
export const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

// Demo credentials info
export const DEMO_CREDENTIALS = [
  { username: "admin", password: "admin123" },
  { username: "user", password: "user123" },
] as const;
