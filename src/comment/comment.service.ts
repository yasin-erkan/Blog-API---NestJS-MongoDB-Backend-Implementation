import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UserDocument } from 'src/user/schema/user.schema';
import { PostService } from 'src/post/post.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    private readonly postService: PostService,
  ) {}

  async create(
    postId: string,
    createCommentDto: CreateCommentDto,
    user: UserDocument,
  ) {
    // check if the post Id is valid
    await this.postService.findOne(postId);

    // create a new comment
    const newComment = new this.commentModel({
      ...createCommentDto,
      post: postId,
      author: user.id,
    });
    // save the comment
    return await newComment.save();
  }

  async delete(id: string, user: UserDocument) {
    // check if the comment exists
    const comment = await this.commentModel.findById(id);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    // check if the user is the author of the comment
    if (comment.author.toString() !== (user.id as string)) {
      throw new ForbiddenException(
        'You are not allowed to delete this comment',
      );
    }
    // delete the comment
    await this.commentModel.findByIdAndDelete(id);
    return { message: 'Comment deleted successfully' };
  }

  async findAllByPost(postId: string) {
    // check if the post exists
    await this.postService.findOne(postId);
    // find all comments by post id
    return await this.commentModel
      .find({ post: postId })
      .populate('author', '-password -refreshToken -__v')
      .sort({ createdAt: -1 });
  }
}
