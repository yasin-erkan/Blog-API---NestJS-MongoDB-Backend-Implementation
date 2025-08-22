import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './schemas/comment.schema';
import { PostModule } from 'src/post/post.module';

@Module({
  controllers: [CommentController],
  providers: [CommentService],
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    PostModule,
  ],
})
export class CommentModule {}
