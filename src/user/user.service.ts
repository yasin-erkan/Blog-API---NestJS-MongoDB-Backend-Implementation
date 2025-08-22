import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { User, UserDocument } from './schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  //  this is to inject the user model created in the schema into the userService(! dependency injection)
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const newUser = new this.userModel(createUserDto);
    const user = await newUser.save();

    return user.toObject();
  }

  // function for getting all users
  async findAll(): Promise<UserDocument[]> {
    const users = await this.userModel.find();
    return users;
  }

  // function for getting a user by id
  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // function for getting a user by username
  async findByUsername(username: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // function for updating a user by id
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // function for deleting a user by id
  async delete(id: string): Promise<UserDocument> {
    const deletedUser = await this.userModel.findByIdAndDelete(id);

    if (!deletedUser) {
      throw new NotFoundException('User not found');
    }

    return deletedUser;
  }

  // !this part is for authentication
  // update refresh token
  async setRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userModel.findByIdAndUpdate(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  // delete refresh token
  async removeRefreshToken(userId: string) {
    await this.userModel.findByIdAndUpdate(userId, { refreshToken: '' });
  }
  // check if user has refresh token
  async hasRefreshToken(userId: string): Promise<boolean> {
    const user = await this.userModel.findById(userId);
    return !!user?.refreshToken;
  }
}
