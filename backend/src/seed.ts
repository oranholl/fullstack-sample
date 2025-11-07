import dotenv from "dotenv";
import { connectDatabase, disconnectDatabase } from "./database";
import { Pokemon, User } from "./models";
import bcrypt from "bcrypt";

dotenv.config();

const SALT_ROUNDS = 10;

async function seedDatabase() {
  console.log("🌱 Starting database seed...\n");

  try {
    await connectDatabase();

    console.log("🗑️  Clearing existing data...");
    await Pokemon.deleteMany({});
    await User.deleteMany({});
    console.log("✅ Cleared\n");

    console.log("🎮 Seeding Pokemon...");
    const pokemonData = [
      {
        pokedexNumber: 1,
        name: "Bulbasaur",
        height: 70,
        weight: 69,
        imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
        types: ["Grass", "Poison"],
        weaknesses: ["Fire", "Ice", "Flying", "Psychic"],
        abilities: ["Overgrow", "Chlorophyll"],
        category: "Seed",
        description: "There is a plant seed on its back right from the day this Pokémon is born. The seed slowly grows larger."
      },
      {
        pokedexNumber: 2,
        name: "Ivysaur",
        height: 100,
        weight: 130,
        imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png",
        types: ["Grass", "Poison"],
        weaknesses: ["Fire", "Ice", "Flying", "Psychic"],
        abilities: ["Overgrow", "Chlorophyll"],
        category: "Seed",
        description: "When the bulb on its back grows large, it appears to lose the ability to stand on its hind legs."
      },
      {
        pokedexNumber: 3,
        name: "Venusaur",
        height: 200,
        weight: 1000,
        imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png",
        types: ["Grass", "Poison"],
        weaknesses: ["Fire", "Ice", "Flying", "Psychic"],
        abilities: ["Overgrow", "Chlorophyll"],
        category: "Seed",
        description: "Its plant blooms when it is absorbing solar energy. It stays on the move to seek sunlight."
      },
      {
        pokedexNumber: 4,
        name: "Charmander",
        height: 60,
        weight: 85,
        imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
        types: ["Fire"],
        weaknesses: ["Water", "Ground", "Rock"],
        abilities: ["Blaze", "Solar Power"],
        category: "Lizard",
        description: "It has a preference for hot things. When it rains, steam is said to spout from the tip of its tail."
      },
      {
        pokedexNumber: 5,
        name: "Charmeleon",
        height: 110,
        weight: 190,
        imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/5.png",
        types: ["Fire"],
        weaknesses: ["Water", "Ground", "Rock"],
        abilities: ["Blaze", "Solar Power"],
        category: "Flame",
        description: "It has a barbaric nature. In battle, it whips its fiery tail around and slashes away with sharp claws."
      },
      {
        pokedexNumber: 6,
        name: "Charizard",
        height: 170,
        weight: 905,
        imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png",
        types: ["Fire", "Flying"],
        weaknesses: ["Water", "Electric", "Rock"],
        abilities: ["Blaze", "Solar Power"],
        category: "Flame",
        description: "It spits fire that is hot enough to melt boulders. It may cause forest fires by blowing flames."
      },
      {
        pokedexNumber: 7,
        name: "Squirtle",
        height: 50,
        weight: 90,
        imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png",
        types: ["Water"],
        weaknesses: ["Electric", "Grass"],
        abilities: ["Torrent", "Rain Dish"],
        category: "Tiny Turtle",
        description: "When it retracts its long neck into its shell, it squirts out water with vigorous force."
      },
      {
        pokedexNumber: 8,
        name: "Wartortle",
        height: 100,
        weight: 225,
        imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/8.png",
        types: ["Water"],
        weaknesses: ["Electric", "Grass"],
        abilities: ["Torrent", "Rain Dish"],
        category: "Turtle",
        description: "It is recognized as a symbol of longevity. If its shell has algae on it, that Wartortle is very old."
      },
      {
        pokedexNumber: 9,
        name: "Blastoise",
        height: 160,
        weight: 855,
        imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png",
        types: ["Water"],
        weaknesses: ["Electric", "Grass"],
        abilities: ["Torrent", "Rain Dish"],
        category: "Shellfish",
        description: "It crushes its foe under its heavy body to cause fainting. In a pinch, it will withdraw inside its shell."
      },
      {
        pokedexNumber: 25,
        name: "Pikachu",
        height: 40,
        weight: 60,
        imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
        types: ["Electric"],
        weaknesses: ["Ground"],
        abilities: ["Static", "Lightning Rod"],
        category: "Mouse",
        description: "When several of these Pokémon gather, their electricity can build and cause lightning storms."
      }
    ];

    const pokemons = await Pokemon.insertMany(pokemonData);
    console.log(`✅ Seeded ${pokemons.length} Pokemon\n`);

    console.log("👥 Seeding Users...");
    const users = [
      { username: "admin", password: "admin123" },
      { username: "user", password: "user123" }
    ];

    for (const userData of users) {
      const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);
      await User.create({
        username: userData.username,
        password: hashedPassword
      });
      console.log(`✅ Created user: ${userData.username}`);
    }

    console.log("\n✨ Database seeded successfully!");
    console.log("\n📊 Summary:");
    console.log(`   - ${pokemons.length} Pokemon`);
    console.log(`   - ${users.length} Users`);
    console.log("\n🔐 Login credentials:");
    console.log("   - admin / admin123");
    console.log("   - user / user123");
    console.log("\n💡 You can now query Pokemon by:");
    console.log("   - MongoDB ID: pokemon(id: \"67abc123...\")")
    console.log("   - Pokedex #: pokemon(id: \"25\") ← Pikachu");

  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  } finally {
    await disconnectDatabase();
  }
}

seedDatabase();
