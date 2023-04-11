import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constant";
import { Post } from "./entities/Post";
import microConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";

const main = async () => {
  const orm = await MikroORM.init(microConfig);
  const emFork = orm.em.fork(); // create the fork of new EntityManager instance
  await orm.getMigrator().up(); // run the Migration question? not sure if emFork.getMigrator().up() or orm

  const app = express();
  const port = 3000;
  //rest endpoint
  // app.get("/", (_, res) => {
  //   res.send("Hello world");
  // });

  //graphql
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver],
      validate: false,
    }),
    context: () => ({ em: emFork }),
  });

  //create graphql endpoint on express
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  app.listen(port, () => {
    console.log(`App listening on ${port}`);
  });
};

main().catch((err) => {
  console.log(err);
});
