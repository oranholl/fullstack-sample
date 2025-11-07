import { readFileSync, writeFileSync } from "fs";
import path from "path";

const dataPath = path.join(__dirname, "data.json");

let pokemons = JSON.parse(readFileSync(dataPath, "utf8"));

export const typeDefs = `#graphql
  type Pokemon {
    id: ID!
    name: String!
    height: Int!
    weight: Int!
    imageUrl: String
  }

  type Query {
    pokemons: [Pokemon!]!
    pokemon(id: ID!): Pokemon
  }

  type Mutation {
    addPokemon(name: String!, height: Int!, weight: Int!, imageUrl: String): Pokemon!
  }
`;

export const resolvers = {
  Query: {
    pokemons: () => pokemons,
    pokemon: (_: any, { id }: { id: string }) =>
      pokemons.find((p: any) => p.id === id),
  },
  Mutation: {
    addPokemon: (
      _: any,
      { name, height, weight, imageUrl }: { name: string; height: number; weight: number; imageUrl?: string }
    ) => {
      const newPokemon = {
        id: String(Date.now()),
        name,
        height,
        weight,
        imageUrl: imageUrl || null,
      };
      pokemons.push(newPokemon);
      writeFileSync(dataPath, JSON.stringify(pokemons, null, 2));
      return newPokemon;
    },
  },
};