import { IsOptional, IsString, Matches } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z0-9_]{3,20}$/, {
    message: 'Username harus 3-20 karakter (huruf, angka, underscore)',
  })
  username?: string;
}
