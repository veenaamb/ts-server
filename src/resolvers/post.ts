import { Post } from "../entities/Post";
import { MyContext } from "src/types";
import { Ctx, Query, Resolver } from "type-graphql";

@Resolver()
export class PostResolver {
  @Query(() => [Post]) //graphql type
  posts(@Ctx() { em }: MyContext): Promise<Post[]> { //typescript type
    return em.find(Post, {});
  }
}