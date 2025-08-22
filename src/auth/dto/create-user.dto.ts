import {
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  IsString,
  MinLength,
  MaxLength,
  
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  username: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  @MinLength(5)
  password: string;
}
