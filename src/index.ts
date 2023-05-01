import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constant";
import microConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import * as dotenv from "dotenv";

import RedisStore from "connect-redis";
import session from "express-session";
import { createClient } from "redis";

const main = async () => {
  dotenv.config();
  // console.log("printing process env ", process.env); 

  const orm = await MikroORM.init(microConfig);
  const emFork = orm.em.fork(); // create the fork of new EntityManager instance
  await orm.getMigrator().up(); // automatically run migration when server restarts, not sure if emFork.getMigrator().up() or orm.getMigrator().up()

  const app = express();
  const port = 3000;
  //rest endpoint
  // app.get("/", (_, res) => {
  //   res.send("Hello world");
  // });

  // Initialize client.
  const redisClient = createClient();
  redisClient.connect().catch(console.error);

  // Initialize store.
  const redisStore = new RedisStore({
    client: redisClient,
    prefix: "myapp:",
    disableTouch: true,
  });
  const session_key = process.env.SESSION_SECRET_KEY as string;

  // Initialize sesssion storage.
  app.use(
    session({
      name: "qid",
      store: redisStore,
      resave: false, // required: force lightweight session keep alive (touch)
      saveUninitialized: false, // recommended: only save session when data exists
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, //10 years,
        httpOnly: true,
        secure: __prod__, //cookie only works in https in prod
        sameSite: "lax",
      },
      secret: session_key,
    })
  );

  //graphql
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
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
