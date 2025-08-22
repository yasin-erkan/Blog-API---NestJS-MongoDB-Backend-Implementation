import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Document } from 'mongoose';


// declare document type of the user schema
export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: '' })
  profilePicture: string;

  @Prop({ default: '' })
  refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User); // ! this is to create a schema for the user model

// ! a middleware to hash the password before saving the user

UserSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});
