import { Injectable, NotFoundException } from '@nestjs/common';
import { ReportReason, ReportTargetType } from '@prisma/client';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(
    private prisma: PrismaService,
    private mail: MailService,
  ) {}

  async create(
    reporterId: string,
    targetType: ReportTargetType,
    targetId: string,
    reason: ReportReason,
    details?: string,
  ) {
    if (targetType === ReportTargetType.STORY) {
      const story = await this.prisma.story.findUnique({
        where: { id: targetId },
      });
      if (!story) throw new NotFoundException('Konten tidak ditemukan');
    } else {
      const comment = await this.prisma.comment.findUnique({
        where: { id: targetId },
      });
      if (!comment) throw new NotFoundException('Konten tidak ditemukan');
    }

    const report = await this.prisma.report.create({
      data: {
        reporterId,
        targetType,
        targetId,
        reason,
        details: details || null,
      },
    });

    await this.mail.sendReportAlert(targetType, targetId, reason, details);
    return report;
  }
}
