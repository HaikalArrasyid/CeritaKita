import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ModerationService {
  constructor(private prisma: PrismaService) {}

  private normalize(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  private hasPii(text: string): boolean {
    const patterns = [
      /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i,
      /(?:\+62|62|0)8\d{8,12}/,
      /\b\d{16}\b/,
    ];
    return patterns.some((p) => p.test(text));
  }

  async isFlagged(text: string): Promise<boolean> {
    const normalized = this.normalize(text);
    if (this.hasPii(normalized)) {
      return true;
    }
    const banned = await this.prisma.bannedWord.findMany({
      select: { word: true },
    });
    return banned.some((b) => normalized.includes(this.normalize(b.word)));
  }
}
