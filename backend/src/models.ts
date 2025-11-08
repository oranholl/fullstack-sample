import mongoose from "mongoose";

const pokemonSchema = new mongoose.Schema({
  pokedexNumber: {
    type: Number,
    unique: true,
    sparse: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  height: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    default: null,
  },
  types: {
    type: [String],
    required: true,
    validate: {
      validator: function(v: string[]) {
        return v && v.length > 0;
      },
      message: 'At least one type is required'
    }
  },
  weaknesses: {
    type: [String],
    default: [],
  },
  abilities: {
    type: [String],
    default: [],
  },
  category: {
    type: String,
    default: null,
  },
  description: {
    type: String,
    default: null,
  },
}, {
  timestamps: true, 
});

pokemonSchema.index({ name: 'text' });
pokemonSchema.index({ types: 1 });
pokemonSchema.index({ pokedexNumber: 1 });

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

export const Pokemon = mongoose.model('Pokemon', pokemonSchema);
export const User = mongoose.model('User', userSchema);
