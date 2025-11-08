import { connectDatabase, disconnectDatabase } from "./database";
import { Pokemon } from "./models";

// Simple migration: Add generation field to Pokemon
export async function migrate() {
  try {
    await connectDatabase();
    console.log("Running migrations...\n");

    // Migration 1: Add generation field
    const result = await Pokemon.updateMany(
      { generation: { $exists: false } },
      { $set: { generation: null } }
    );
    console.log(`Added generation field to ${result.modifiedCount} Pokemon`);

    console.log("Migrations completed!");
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  } finally {
    await disconnectDatabase();
  }
}

// Run if executed directly
if (require.main === module) {
  migrate().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
