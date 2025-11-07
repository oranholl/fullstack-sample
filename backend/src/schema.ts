import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { gql } from "graphql-tag";

const dataPath = path.join(__dirname, "data.json");

let pokemons = JSON.parse(readFileSync(dataPath, "utf8"));

export const typeDefs = gql`
  type Pokemon {
    id: ID!
    name: String!
    type: String!
  }

  type Query {
    pokemons: [Pokemon!]!
    pokemon(id: ID!): Pokemon
  }

  type Mutation {
    addPokemon(name: String!, type: String!): Pokemon!
  }
`;

export const resolvers = {
  Query: {
    pokemons: () => pokemons,
    pokemon: (_: any, { id }: { id: string }) =>
      pokemons.find((p: any) => p.id === id),
  },
  Mutation: {
    addPokemon: (_: any, { name, type }: { name: string; type: string }) => {
      const newPokemon = { id: String(Date.now()), name, type };
      pokemons.push(newPokemon);
      writeFileSync(dataPath, JSON.stringify(pokemons, null, 2));
      return newPokemon;
    },
  },
};
