import { Post } from "../entities/Post";
import { MyContext } from "src/types";
import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export class PostResolver {
  //read all posts
  @Query(() => [Post]) //graphql type
  posts(@Ctx() { em }: MyContext): Promise<Post[]> {
    //typescript type
    return em.find(Post, {});
  }
  //read post for given id - return null otherwise
  @Query(() => Post, { nullable: true }) // graphql return type Post | null return type
  post(
    @Arg("id", () => Int) id: number,  //no need to explicitly mention () => Int, typegraphql can infer int, strings 
    @Ctx() { em }: MyContext
  ): Promise<Post | null> { //typescript type
    return em.findOne(Post, { id });
  }
  //create
  @Mutation(() => Post) // graphql return type Post | null return type
  async createPost(
    @Arg("title", ()=> String) title: string, // String(wrapper object) is a different type from string(primitive datatype) here, use of ()=> SString is optional, typegraphql can infer without it 
    @Ctx() { em }: MyContext
  ): Promise<Post> { //typescript type
    const post = em.create(Post, {title})
    await em.persistAndFlush(post)
    return post;
  }

}
