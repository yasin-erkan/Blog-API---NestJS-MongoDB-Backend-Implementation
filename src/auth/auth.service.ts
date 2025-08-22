import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from '../user/schema/user.schema';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // check if data is valid
  async validateUser(username: string, password: string) {
    const user = await this.userService.findByUsername(username);
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (user && isPasswordValid) {
      return user;
    }
    return null;
  }

  // ! generate jwt token(access token,refresh token)

  generateAccessToken(userId: string, username: string) {
    const payload = { sub: userId, username };

    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
    });
  }

  async generateRefreshToken(userId: string, username: string) {
    const payload = { sub: userId, username };

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
    });

    // save refresh token to database
    await this.userService.setRefreshToken(userId, refreshToken);

    return refreshToken;
  }

  async generateTokens(userId: string, username: string) {
    const accessToken = await this.generateAccessToken(userId, username);
    const refreshToken = await this.generateRefreshToken(userId, username);

    return { accessToken, refreshToken };
  }

  // ! register
  async register(createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.create(createUserDto);

      return user;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException('User already exists');
      }
      throw new BadRequestException('User registration failed');
    }
  }

  // ! login
  async login(user: UserDocument) {
    const tokens = await this.generateTokens(user._id as string, user.username);

    return {
      user: {
        id: (user._id as string).toString(),
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
      },
      access: tokens.accessToken,
      refresh: tokens.refreshToken,
    };
  }

  // ! refresh token
  async refreshToken(user: any) {
    const { _id, username } = user;
    return this.generateTokens(_id, username);
  }

  // ! logout
  async logout(userId: string) {
    await this.userService.removeRefreshToken(userId);
    return { message: 'Logged out successfully' };
  }
}
