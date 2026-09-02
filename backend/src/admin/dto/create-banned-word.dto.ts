import { IsString, MinLength } from 'class-validator';

export class CreateBannedWordDto {
  @IsString()
  @MinLength(2, { message: 'Kata minimal 2 karakter' })
  word: string;
}
