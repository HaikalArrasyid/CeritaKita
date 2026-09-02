import { ReportAction } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class ResolveReportDto {
  @IsEnum(ReportAction, { message: 'Aksi tidak valid' })
  action: ReportAction;
}
