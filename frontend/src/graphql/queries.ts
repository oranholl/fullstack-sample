import { gql } from "@apollo/client";

export const GET_POKEMONS = gql`
  query GetPokemons(
    $page: Int!
    $pageSize: Int!
    $sortBy: SortField!
    $sortOrder: SortOrder!
    $filter: PokemonFilterInput
  ) {
    pokemons(
      page: $page
      pageSize: $pageSize
      sortBy: $sortBy
      sortOrder: $sortOrder
      filter: $filter
    ) {
      items {
        id
        pokedexNumber
        name
        height
        weight
        imageUrl
        types
      }
      totalCount
      pageInfo {
        currentPage
        totalPages
        pageSize
      }
    }
  }
`;

export const GET_POKEMON = gql`
  query GetPokemon($id: ID!) {
    pokemon(id: $id) {
      id
      pokedexNumber
      name
      height
      weight
      imageUrl
      types
      weaknesses
      abilities
      category
      description
    }
  }
`;

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        username
      }
    }
  }
`;

export const REGISTER = gql`
  mutation Register($username: String!, $password: String!) {
    register(username: $username, password: $password) {
      token
      user {
        username
      }
    }
  }
`;

export const ADD_POKEMON = gql`
  mutation AddPokemon(
    $token: String!
    $name: String!
    $height: Int!
    $weight: Int!
    $imageUrl: String
    $types: [String!]!
    $weaknesses: [String!]
    $abilities: [String!]
    $category: String
    $description: String
  ) {
    addPokemon(
      token: $token
      name: $name
      height: $height
      weight: $weight
      imageUrl: $imageUrl
      types: $types
      weaknesses: $weaknesses
      abilities: $abilities
      category: $category
      description: $description
    ) {
      id
      name
    }
  }
`;

export const UPDATE_POKEMON = gql`
  mutation UpdatePokemon(
    $token: String!
    $id: ID!
    $name: String
    $height: Int
    $weight: Int
    $imageUrl: String
  ) {
    updatePokemon(
      token: $token
      id: $id
      name: $name
      height: $height
      weight: $weight
      imageUrl: $imageUrl
    ) {
      id
      name
    }
  }
`;

export const DELETE_POKEMON = gql`
  mutation DeletePokemon($token: String!, $id: ID!) {
    deletePokemon(token: $token, id: $id)
  }
`;