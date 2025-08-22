import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from '../../user/schema/user.schema';

// declare document type of the post schema
export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author: User;

  @Prop({ required: true })
  tags: string[];

  @Prop({ required: true })
  photo: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
