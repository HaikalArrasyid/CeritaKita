import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: Transporter | null = null;

  constructor(private config: ConfigService) {
    const host = config.get<string>('SMTP_HOST');
    const user = config.get<string>('SMTP_USER');
    if (host && user) {
      this.transporter = nodemailer.createTransport({
        host,
        port: Number(config.get('SMTP_PORT') || 587),
        auth: { user, pass: config.get('SMTP_PASS') || '' },
      });
    } else {
      this.logger.warn(
        'SMTP not configured — emails will be logged to console only',
      );
    }
  }

  private async send(to: string, subject: string, text: string): Promise<void> {
    if (!this.transporter) {
      this.logger.log(`[MAIL] to=${to} subject="${subject}"\n${text}`);
      return;
    }
    const from =
      this.config.get<string>('MAIL_FROM') ||
      'CeritaKita <no-reply@ceritakita.id>';
    await this.transporter.sendMail({ from, to, subject, text });
  }

  async sendOtp(email: string, code: string): Promise<void> {
    const text = `Halo,\n\nKode verifikasi kamu adalah: ${code}\n\nKode berlaku 10 menit. Jika kamu tidak meminta, abaikan email ini.`;
    await this.send(email, 'Kode verifikasi CeritaKita', text);
  }

  async sendReportAlert(
    targetType: string,
    targetId: string,
    reason: string,
    details?: string,
  ): Promise<void> {
    const text = `Laporan baru diterima.\n\nTarget: ${targetType} (${targetId})\nAlasan: ${reason}\nDetail: ${details || '-'}\n\nBuka dashboard admin untuk meninjau.`;
    const adminEmail =
      this.config.get<string>('ADMIN_EMAIL') || 'admin@ceritakita.id';
    await this.send(
      adminEmail,
      `[CeritaKita] Laporan baru — ${targetType}`,
      text,
    );
  }
}
