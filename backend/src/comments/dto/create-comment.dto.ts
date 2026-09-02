import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @MinLength(1, { message: 'Komentar tidak boleh kosong' })
  @MaxLength(2000, { message: 'Komentar maksimal 2000 karakter' })
  content: string;
}
