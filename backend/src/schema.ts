import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { Pokemon, User } from "./models";

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRES_IN = "24h";
const SALT_ROUNDS = 10;

export const typeDefs = `#graphql
  type Pokemon {
    id: ID!
    pokedexNumber: Int
    name: String!
    height: Int!
    weight: Int!
    imageUrl: String
    types: [String!]!
    weaknesses: [String!]!
    abilities: [String!]!
    category: String
    description: String
  }

  type PokemonConnection {
    items: [Pokemon!]!
    totalCount: Int!
    pageInfo: PageInfo!
  }

  type PageInfo {
    currentPage: Int!
    totalPages: Int!
    pageSize: Int!
  }

  type User {
    username: String!
    token: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input PokemonFilterInput {
    name: String
    minHeight: Int
    maxHeight: Int
    minWeight: Int
    maxWeight: Int
    type: String
  }

  enum SortField {
    NAME
    HEIGHT
    WEIGHT
  }

  enum SortOrder {
    ASC
    DESC
  }

  type Query {
    pokemons(
      page: Int = 1
      pageSize: Int = 10
      sortBy: SortField = NAME
      sortOrder: SortOrder = ASC
      filter: PokemonFilterInput
    ): PokemonConnection!
    
    pokemon(id: ID!): Pokemon
    me(token: String!): User
  }

  type Mutation {
    login(username: String!, password: String!): AuthPayload!
    register(username: String!, password: String!): AuthPayload!
    
    addPokemon(
      token: String!
      name: String!
      height: Int!
      weight: Int!
      imageUrl: String
      types: [String!]!
      weaknesses: [String!]
      abilities: [String!]
      category: String
      description: String
    ): Pokemon!
    
    updatePokemon(
      token: String!
      id: ID!
      name: String
      height: Int
      weight: Int
      imageUrl: String
      types: [String!]
      weaknesses: [String!]
      abilities: [String!]
      category: String
      description: String
    ): Pokemon!
    
    deletePokemon(token: String!, id: ID!): Boolean!
  }
`;

function generateToken(username: string): string {
  return jwt.sign({ username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function verifyToken(token: string): { username: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { username: string };
    return decoded;
  } catch (error) {
    return null;
  }
}

async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

function authenticate(token: string): { username: string } {
  const user = verifyToken(token);
  if (!user) {
    throw new Error("Authentication required. Invalid or expired token.");
  }
  return user;
}

async function findPokemonById(id: string) {
  // Try as MongoDB ObjectId first
  if (mongoose.Types.ObjectId.isValid(id)) {
    const pokemon = await Pokemon.findById(id).lean();
    if (pokemon) return pokemon;
  }
  
  // Try as Pokedex number
  const pokedexNumber = parseInt(id);
  if (!isNaN(pokedexNumber)) {
    const pokemon = await Pokemon.findOne({ pokedexNumber }).lean();
    if (pokemon) return pokemon;
  }
  
  return null;
}


export const resolvers = {
  Query: {
    pokemons: async (
      _: any,
      {
        page = 1,
        pageSize = 10,
        sortBy = "NAME",
        sortOrder = "ASC",
        filter,
      }: {
        page: number;
        pageSize: number;
        sortBy: string;
        sortOrder: string;
        filter?: any;
      }
    ) => {
      // Validate pageSize
      if (![10, 20, 50].includes(pageSize)) {
        throw new Error("Page size must be 10, 20, or 50");
      }

      // Build MongoDB query
      const query: any = {};

      if (filter) {
        if (filter.name) {
          query.name = { $regex: filter.name, $options: 'i' }; // Case-insensitive search
        }
        if (filter.minHeight !== undefined) {
          query.height = { ...query.height, $gte: filter.minHeight };
        }
        if (filter.maxHeight !== undefined) {
          query.height = { ...query.height, $lte: filter.maxHeight };
        }
        if (filter.minWeight !== undefined) {
          query.weight = { ...query.weight, $gte: filter.minWeight };
        }
        if (filter.maxWeight !== undefined) {
          query.weight = { ...query.weight, $lte: filter.maxWeight };
        }
        if (filter.type) {
          query.types = { $in: [new RegExp(filter.type, 'i')] };
        }
      }

      // Build sort
      const sortField = sortBy === "NAME" ? "name" : sortBy.toLowerCase();
      const sortDirection = sortOrder === "ASC" ? 1 : -1;
      const sort: any = { [sortField]: sortDirection };

      // Get total count
      const totalCount = await Pokemon.countDocuments(query);

      // Get paginated results
      const skip = (page - 1) * pageSize;
      const items = await Pokemon.find(query)
        .sort(sort)
        .skip(skip)
        .limit(pageSize)
        .lean();

      // Calculate pagination info
      const totalPages = Math.ceil(totalCount / pageSize);

      return {
        items: items.map(item => ({
          ...item,
          id: item._id.toString(),
        })),
        totalCount,
        pageInfo: {
          currentPage: page,
          totalPages,
          pageSize,
        },
      };
    },

    pokemon: async (_: any, { id }: { id: string }) => {
      const pokemon = await findPokemonById(id);
      if (!pokemon) {
        throw new Error("Pokemon not found");
      }
      return {
        ...pokemon,
        id: pokemon._id.toString(),
      };
    },

    me: (_: any, { token }: { token: string }) => {
      const user = verifyToken(token);
      if (!user) {
        throw new Error("Invalid or expired token");
      }
      return { username: user.username, token };
    },
  },

  Mutation: {
    login: async (_: any, { username, password }: { username: string; password: string }) => {
      const user = await User.findOne({ username: username.toLowerCase() });
      
      if (!user) {
        throw new Error("Invalid username or password");
      }

      const isValid = await comparePassword(password, user.password);
      
      if (!isValid) {
        throw new Error("Invalid username or password");
      }

      const token = generateToken(user.username);

      return {
        token,
        user: { username: user.username, token },
      };
    },

    register: async (_: any, { username, password }: { username: string; password: string }) => {
      // Check if user already exists
      const existingUser = await User.findOne({ username: username.toLowerCase() });
      
      if (existingUser) {
        throw new Error("Username already exists");
      }

      // Validate password strength
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create new user
      const newUser = await User.create({
        username: username.toLowerCase(),
        password: hashedPassword,
      });

      // Generate JWT token
      const token = generateToken(newUser.username);

      return {
        token,
        user: { username: newUser.username, token },
      };
    },

    addPokemon: async (
      _: any,
      {
        token,
        name,
        height,
        weight,
        imageUrl,
        types,
        weaknesses,
        abilities,
        category,
        description,
      }: {
        token: string;
        name: string;
        height: number;
        weight: number;
        imageUrl?: string;
        types: string[];
        weaknesses?: string[];
        abilities?: string[];
        category?: string;
        description?: string;
      }
    ) => {
      authenticate(token);

      const newPokemon = await Pokemon.create({
        name,
        height,
        weight,
        imageUrl: imageUrl || null,
        types,
        weaknesses: weaknesses || [],
        abilities: abilities || [],
        category: category || null,
        description: description || null,
      });

      return {
        ...newPokemon.toObject(),
        id: newPokemon._id.toString(),
      };
    },

    updatePokemon: async (
      _: any,
      {
        token,
        id,
        name,
        height,
        weight,
        imageUrl,
        types,
        weaknesses,
        abilities,
        category,
        description,
      }: {
        token: string;
        id: string;
        name?: string;
        height?: number;
        weight?: number;
        imageUrl?: string;
        types?: string[];
        weaknesses?: string[];
        abilities?: string[];
        category?: string;
        description?: string;
      }
    ) => {
      authenticate(token);

      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (height !== undefined) updateData.height = height;
      if (weight !== undefined) updateData.weight = weight;
      if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
      if (types !== undefined) updateData.types = types;
      if (weaknesses !== undefined) updateData.weaknesses = weaknesses;
      if (abilities !== undefined) updateData.abilities = abilities;
      if (category !== undefined) updateData.category = category;
      if (description !== undefined) updateData.description = description;

      // Try to find by MongoDB ID or Pokedex number
      let pokemon;
      if (mongoose.Types.ObjectId.isValid(id)) {
        pokemon = await Pokemon.findByIdAndUpdate(
          id,
          updateData,
          { new: true, runValidators: true }
        );
      } else {
        const pokedexNumber = parseInt(id);
        if (!isNaN(pokedexNumber)) {
          pokemon = await Pokemon.findOneAndUpdate(
            { pokedexNumber },
            updateData,
            { new: true, runValidators: true }
          );
        }
      }

      if (!pokemon) {
        throw new Error("Pokemon not found");
      }

      return {
        ...pokemon.toObject(),
        id: pokemon._id.toString(),
      };
    },

    deletePokemon: async (_: any, { token, id }: { token: string; id: string }) => {
      authenticate(token);

      let result;
      
      // Try to delete by MongoDB ID or Pokedex number
      if (mongoose.Types.ObjectId.isValid(id)) {
        result = await Pokemon.findByIdAndDelete(id);
      } else {
        const pokedexNumber = parseInt(id);
        if (!isNaN(pokedexNumber)) {
          result = await Pokemon.findOneAndDelete({ pokedexNumber });
        }
      }

      if (!result) {
        throw new Error("Pokemon not found");
      }

      return true;
    },
  },
};