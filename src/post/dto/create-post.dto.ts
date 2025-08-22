import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsArray()
  @IsNotEmpty()
  tags: string[];

  @IsString()
  @IsNotEmpty()
  photo: string;
}
