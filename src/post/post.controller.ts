import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import type { Request as Req } from 'express';
import { PostService } from './post.service';
import { UserDocument } from 'src/user/schema/user.schema';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req: Req, @Body() createPostDto: CreatePostDto) {
    return this.postService.create(req.user as UserDocument, createPostDto);
  }

  @Get()
  findAll(
    // ! Since data coming from the query in string format, we need to parse it to a number
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return this.postService.findAll(page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Request() req: Req,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.update(id, req.user as UserDocument, updatePostDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string, @Request() req: Req) {
    return this.postService.delete(id, req.user as UserDocument);
  }
}
