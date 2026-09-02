import { ContentStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateStatusDto {
  @IsEnum(ContentStatus, { message: 'Status tidak valid' })
  status: ContentStatus;
}
