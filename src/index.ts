import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constant";
import { Post } from "./entities/Post";
import microConfig from "./mikro-orm.config";

const main = async () => {
  const orm = await MikroORM.init(microConfig);
  const emFork = orm.em.fork(); // create the fork of new EntityManager instance
  await orm.getMigrator().up(); // run the Migration question? not sure if emFork.getMigrator().up() or orm

  // const post = emFork.create(Post, { title: "my first post" }); //use the fork instead of global `orm.em`, as we don't want to change global EntityManager em instance
  // await emFork.persistAndFlush(post);

  // const posts = await emFork.find(Post, {});
  // console.log(posts);
};

main().catch((err) => {
  console.log(err);
});
