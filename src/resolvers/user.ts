import { User } from "../entities/User";
import { MyContext } from "src/types";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Resolver,
} from "type-graphql";
import * as argon2 from "argon2";

//instead of creating multiple Args like in post.ts resolver, you can create a single class and pass it
@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;
  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Mutation(() => User)
  async register(
    @Arg("options", () => UsernamePasswordInput) options: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    if (options.username.length <= 2) {
      return {
        errors: [
          { field: "username", message: "length must be greater than 2" },
        ],
      };
    }
    if (options.password.length <= 2) {
      return {
        errors: [
          { field: "password", message: "length must be greater than 2" },
        ],
      };
    }
    const hashedPassword = await argon2.hash(options.password);
    const user = em.create(User, {
      username: options.username,
      password: hashedPassword,
    });
    try {
      await em.persistAndFlush(user);
    } catch (err) {
      console.log("jesus message: ", err.message);
    }
    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options", () => UsernamePasswordInput) options: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, {
      username: options.username.toLowerCase(),
    });
    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "the username does not exist",
          },
        ], //username does not match
      };
    }
    const isPasswordMatch = await argon2.verify(
      user.password,
      options.password
    );
    if (!isPasswordMatch) {
      return {
        errors: [{ field: "password", message: "incorrect password" }],
      };
    }
    return { user };
  }
}
