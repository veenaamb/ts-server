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
    @Arg("id", () => Int) id: number, //no need to explicitly mention () => Int, typegraphql can infer int, strings
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    //typescript type
    return em.findOne(Post, { id });
  }

  //create
  @Mutation(() => Post) // graphql return type Post | null return type
  async createPost(
    @Arg("title", () => String) title: string, // String(wrapper object) is a different type from string(primitive datatype) here, use of ()=> SString is optional, typegraphql can infer without it
    @Ctx() { em }: MyContext
  ): Promise<Post> {
    //typescript type
    const post = em.create(Post, { title });
    await em.persistAndFlush(post);
    return post;
  }

  //update an existing post
  @Mutation(() => Post, { nullable: true }) // graphql return type Post | null return type
  async updatePost(
    @Arg("title", () => String, { nullable: true }) title: string, // ()=> String, {nullable:true} sets the title to string or null as input
    @Arg("id") id: number,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    //typescript type
    const post = await em.findOne(Post, { id });
    if (!post) {
      return null;
    }
    if (typeof title !== "undefined") { //title talks about input parameter for the updatepost call here
      //since title can be null
      post.title = title;
      await em.persistAndFlush(post);
    }
    return post;
  }

  //delete
  @Mutation(() => Boolean) // graphql return type Post | null return type
  async deletePost(
    @Arg("id") id: number,
    @Ctx() { em }: MyContext
  ): Promise<Boolean> {
    //typescript type
    try {
      await em.nativeDelete(Post, { id });
      return true;
    } catch {
      return false;
    }
  }
}
