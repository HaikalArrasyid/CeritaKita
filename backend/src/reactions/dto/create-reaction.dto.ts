import { ReactionType } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class CreateReactionDto {
  @IsEnum(ReactionType, { message: 'Tipe reaksi tidak valid' })
  type: ReactionType;
}
