import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth.guards';
import { LocalAuthGuard } from './guards/local-auth.guards';
import type { Request as Req } from 'express';
import { User, UserDocument } from 'src/user/schema/user.schema';







@Controller('auth')
export class AuthController {
  constructor(private readonly authservice: AuthService) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authservice.register(createUserDto);
  }

  // ! verify username and password by using local strategy
  // return tokens created in authService
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Request() req:Req) {
    return this.authservice.login(req.user as UserDocument);
  }

  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  refresh(@Request() req:Req) {
    return {
      accessToken: this.authservice.generateAccessToken(
        req.user!._id,
        req.user!.username ,
      ),
    };
  }

  // to logout, i need to verify access token by using jwt strategy
  // and then i need to remove refresh token from database
  // and then i need to return a message that the user is logged out
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req:Req) {
    return await this.authservice.logout(req.user!._id );
  }
}
