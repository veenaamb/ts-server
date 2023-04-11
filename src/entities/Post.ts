import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
//[OptionalProps]?: 'createdAt' | 'updatedAt';

@ObjectType()
@Entity()
export class Post {
  @Field()
  @PrimaryKey()
  id!: number;

  @Field(()=> String)
  @Property({ type: "date" })
  createdAt?: Date = new Date();

  @Field(()=> String)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt?: Date = new Date();

  @Field()
  @Property({ type: "text" })
  title!: string;
}
