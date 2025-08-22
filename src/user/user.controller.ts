import {
  Controller,
  Get,
  Patch,
  Request,
  UseGuards,
  Body,
} from '@nestjs/common';

import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import type { Request as Req } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //verifying access token and returning user details
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Request() req: Req) {
    // we have already verified the access token in the jwt-auth.guard
    // so we can access the user details from the request object
    return req.user;
  }

  // updating user details
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateProfile(
    @Request() req: Req,
    @Body() updateProfileDto: UpdateUserDto,
  ) {
    return this.userService.update(req.user!._id, updateProfileDto);
  }
}
