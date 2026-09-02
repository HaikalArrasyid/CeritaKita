import { Body, Controller, Post } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private reports: ReportsService) {}

  @Post()
  create(@CurrentUser() user: { id: string }, @Body() dto: CreateReportDto) {
    return this.reports.create(
      user.id,
      dto.targetType,
      dto.targetId,
      dto.reason,
      dto.details,
    );
  }
}
