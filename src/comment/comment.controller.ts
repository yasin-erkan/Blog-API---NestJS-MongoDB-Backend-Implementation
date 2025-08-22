import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import type { Request as Req } from 'express';
import { UserDocument } from 'src/user/schema/user.schema';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller()
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // get all comments for a post
  @UseGuards(JwtAuthGuard)
  @Get('/post/:postId/comments')
  findAllByPost(@Param('postId') postId: string) {
    return this.commentService.findAllByPost(postId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/post/:postId/comments')
  create(
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Request() req: Req,
  ) {
  
    return this.commentService.create(
      postId,
      createCommentDto,
      req.user as UserDocument,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/comments/:id')
  delete(@Param('id') id: string, @Request() req: Req) {
    return this.commentService.delete(id, req.user as UserDocument);
  }
}
