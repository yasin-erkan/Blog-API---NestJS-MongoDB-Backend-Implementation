import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { UserDocument } from 'src/user/schema/user.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async create(
    user: UserDocument,
    createPostDto: CreatePostDto,
  ): Promise<PostDocument> {
    const newPost = new this.postModel({ ...createPostDto, author: user.id });

    return newPost.save();
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    posts: PostDocument[];
    total: number;
    totalPages: number;
  }> {
    if (page < 1 || limit < 1) {
      throw new BadRequestException('Page and limit must be greater than 0');
    }
    if (limit > 50) {
      throw new BadRequestException('Limit must be less than 50');
    }
    // ! add pagination =>i am running the function that renders all queries and total posts at the same time
    const [posts, total] = await Promise.all([
      this.postModel
        .find()
        .populate('author', '-password -refreshToken -__v')
        .skip((page - 1) * limit)
        .limit(limit),
      this.postModel.countDocuments(),
    ]);
    return { posts, total, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const post = await this.postModel
      .findById(id)
      .populate('author', '-password -refreshToken -__v');

    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  async update(id: string, user: UserDocument, updatePostDto: UpdatePostDto) {
    //  find the post by id
    const post = await this.postModel.findById(id);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.author.toString() !== user.id) {
      throw new ForbiddenException(
        'You are not authorized to update this post',
      );
    }
    return this.postModel.findByIdAndUpdate(id, updatePostDto, { new: true });
  }

  async delete(id: string, user: UserDocument) {
    const post = await this.postModel.findById(id);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.author.toString() !== user.id) {
      throw new ForbiddenException(
        'You are not authorized to delete this post',
      );
    }

    await this.postModel.findByIdAndDelete(id);
    return { message: 'Post deleted successfully' };
  }
}
