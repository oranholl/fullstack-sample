import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import bodyParser from "body-parser";
import { typeDefs, resolvers } from "./schema";

async function startServer() {
  const app = express();
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    expressMiddleware(server)
  );

  const PORT = 4000;
  app.listen(PORT, () =>
    console.log(`🚀 Server running at http://localhost:${PORT}/graphql`)
  );
}

startServer();