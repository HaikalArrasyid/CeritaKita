import { Category } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateStoryDto {
  @IsString()
  @MinLength(3, { message: 'Judul minimal 3 karakter' })
  @MaxLength(120, { message: 'Judul maksimal 120 karakter' })
  title: string;

  @IsEnum(Category, { message: 'Kategori tidak valid' })
  category: Category;

  @IsString()
  @MinLength(1, { message: 'Isi cerita tidak boleh kosong' })
  @MaxLength(5000, { message: 'Isi cerita maksimal 5000 karakter' })
  content: string;

  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;
}
