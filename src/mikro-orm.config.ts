import { __prod__ } from "./constant";
import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/core";
import path from "path";

export default {
  migrations: {
    path: path.join(__dirname, "./migrations"), //dirname = projectAbsolutePath/ts-server/dist, path to the folder with migrations
    pattern: /^[\w-]+\d+\.[tj]s$/, // match migration files (all .js and .ts files)
  },
  entities: [Post],
  dbName: "tsdb",
  type: "postgresql",
  debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0];
