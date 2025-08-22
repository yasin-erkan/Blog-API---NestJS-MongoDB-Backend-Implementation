import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { UserDocument } from 'src/user/schema/user.schema';


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(
    username: string,
    password: string,
  ): Promise<any> {
    const user = await this.authService.validateUser(username, password);

    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }
    // im adding user data to the request object
    // so that i can use it in the controller
    // same like "request.user = user;"
    return user as UserDocument;
  }
}
