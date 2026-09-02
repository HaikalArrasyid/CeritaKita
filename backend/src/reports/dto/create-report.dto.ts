import { ReportReason, ReportTargetType } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateReportDto {
  @IsEnum(ReportTargetType, { message: 'Tipe target tidak valid' })
  targetType: ReportTargetType;

  @IsString()
  targetId: string;

  @IsEnum(ReportReason, { message: 'Alasan tidak valid' })
  reason: ReportReason;

  @IsOptional()
  @IsString()
  details?: string;
}
