import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ContentStatus, ReportAction, ReportTargetType } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { AdminCreateUserDto } from './dto/admin-create-user.dto';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getSettings() {
    const settings = await this.prisma.systemSetting.findMany();
    const result: Record<string, string> = {};
    for (const s of settings) {
      result[s.key] = s.value;
    }
    // Default values if not set
    if (!result['REQUIRE_MANUAL_REVIEW']) {
      result['REQUIRE_MANUAL_REVIEW'] = 'false';
    }
    return result;
  }

  async updateSetting(key: string, value: string) {
    return this.prisma.systemSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  listReports() {
    return this.prisma.report.findMany({
      where: { status: 'PENDING' },
      include: {
        reporter: { select: { id: true, username: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async resolveReport(id: string, action: ReportAction, adminId: string) {
    const report = await this.prisma.report.findUnique({ where: { id } });
    if (!report) throw new NotFoundException('Laporan tidak ditemukan');

    if (action === ReportAction.REMOVE) {
      if (report.targetType === ReportTargetType.STORY) {
        await this.prisma.story.update({
          where: { id: report.targetId },
          data: { status: ContentStatus.REMOVED },
        });
      } else {
        await this.prisma.comment.update({
          where: { id: report.targetId },
          data: { status: ContentStatus.REMOVED },
        });
      }
    }

    return this.prisma.report.update({
      where: { id },
      data: {
        status: 'REVIEWED',
        action,
        resolvedById: adminId,
        resolvedAt: new Date(),
      },
    });
  }

  async listModeration() {
    const [stories, comments] = await Promise.all([
      this.prisma.story.findMany({
        where: { status: 'PENDING' },
        include: { author: { select: { id: true, username: true } } },
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.comment.findMany({
        where: { status: 'PENDING' },
        include: {
          author: { select: { id: true, username: true } },
          story: { select: { id: true, title: true } },
        },
        orderBy: { createdAt: 'asc' },
      }),
    ]);
    return { stories, comments };
  }

  async updateStoryStatus(id: string, status: ContentStatus) {
    const story = await this.prisma.story.findUnique({ where: { id } });
    if (!story) throw new NotFoundException('Cerita tidak ditemukan');
    return this.prisma.story.update({ where: { id }, data: { status } });
  }

  async updateCommentStatus(id: string, status: ContentStatus) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) throw new NotFoundException('Komentar tidak ditemukan');
    return this.prisma.comment.update({ where: { id }, data: { status } });
  }

  async analytics() {
    const [
      totalUsers,
      totalStories,
      totalComments,
      totalReactions,
      reportsPending,
      reportsReviewed,
      storiesByCategoryRaw,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.story.count(),
      this.prisma.comment.count(),
      this.prisma.reaction.count(),
      this.prisma.report.count({ where: { status: 'PENDING' } }),
      this.prisma.report.count({ where: { status: 'REVIEWED' } }),
      this.prisma.story.groupBy({ by: ['category'], _count: true }),
    ]);

    const removedStories = await this.prisma.story.count({
      where: { status: 'REMOVED' },
    });
    const removedComments = await this.prisma.comment.count({
      where: { status: 'REMOVED' },
    });

    return {
      totalUsers,
      totalStories,
      totalComments,
      totalReactions,
      reportsPending,
      reportsReviewed,
      contentRemoved: removedStories + removedComments,
      storiesByCategory: storiesByCategoryRaw.map((s) => ({
        category: s.category,
        count: s._count,
      })),
    };
  }

  listBannedWords() {
    return this.prisma.bannedWord.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async addBannedWord(word: string) {
    const normalized = word.trim().toLowerCase();
    const existing = await this.prisma.bannedWord.findUnique({
      where: { word: normalized },
    });
    if (existing) throw new ConflictException('Kata sudah ada');
    return this.prisma.bannedWord.create({ data: { word: normalized } });
  }

  async removeBannedWord(id: string) {
    await this.prisma.bannedWord.delete({ where: { id } });
    return { ok: true };
  }

  // --- Users CRUD ---

  listUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createUser(dto: AdminCreateUserDto) {
    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.email }, { username: dto.username }],
      },
    });

    if (existing) {
      throw new ConflictException('Email atau username sudah terdaftar');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    return this.prisma.user.create({
      data: {
        email: dto.email,
        username: dto.username,
        passwordHash,
        role: dto.role || 'USER',
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async updateUser(id: string, dto: AdminUpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User tidak ditemukan');

    if (dto.email || dto.username) {
      const existing = await this.prisma.user.findFirst({
        where: {
          OR: [
            { email: dto.email || undefined },
            { username: dto.username || undefined },
          ],
          NOT: { id },
        },
      });
      if (existing) {
        throw new ConflictException('Email atau username sudah digunakan');
      }
    }

    const data: any = { ...dto };
    if (dto.password) {
      data.passwordHash = await bcrypt.hash(dto.password, 10);
      delete data.password;
    }

    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        updatedAt: true,
      },
    });
  }

  async deleteUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User tidak ditemukan');

    await this.prisma.user.delete({ where: { id } });
    return { ok: true };
  }

  // --- Stories CRUD ---

  listStories() {
    return this.prisma.story.findMany({
      include: {
        author: { select: { id: true, username: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createStory(adminId: string, dto: any) {
    return this.prisma.story.create({
      data: {
        title: dto.title,
        content: dto.content,
        category: dto.category,
        isAnonymous: dto.isAnonymous || false,
        status: dto.status || 'PUBLISHED', // admin default
        authorId: adminId,
      },
    });
  }

  async updateStory(id: string, dto: any) {
    const story = await this.prisma.story.findUnique({ where: { id } });
    if (!story) throw new NotFoundException('Cerita tidak ditemukan');

    return this.prisma.story.update({
      where: { id },
      data: {
        title: dto.title,
        content: dto.content,
        category: dto.category,
        isAnonymous: dto.isAnonymous,
        status: dto.status,
      },
    });
  }

  async deleteStory(id: string) {
    const story = await this.prisma.story.findUnique({ where: { id } });
    if (!story) throw new NotFoundException('Cerita tidak ditemukan');

    await this.prisma.story.delete({ where: { id } });
    return { ok: true };
  }

  // --- Articles CRUD ---

  listArticles() {
    return this.prisma.article.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async createArticle(dto: any) {
    return this.prisma.article.create({
      data: {
        title: dto.title,
        slug: dto.slug,
        summary: dto.summary,
        content: dto.content,
        coverImage: dto.coverImage,
        published: dto.published ?? true,
      },
    });
  }

  async updateArticle(id: string, dto: any) {
    const article = await this.prisma.article.findUnique({ where: { id } });
    if (!article) throw new NotFoundException('Artikel tidak ditemukan');

    return this.prisma.article.update({
      where: { id },
      data: {
        title: dto.title,
        slug: dto.slug,
        summary: dto.summary,
        content: dto.content,
        coverImage: dto.coverImage,
        published: dto.published,
      },
    });
  }

  async deleteArticle(id: string) {
    const article = await this.prisma.article.findUnique({ where: { id } });
    if (!article) throw new NotFoundException('Artikel tidak ditemukan');

    await this.prisma.article.delete({ where: { id } });
    return { ok: true };
  }

  // --- Comments CRUD ---

  listComments() {
    return this.prisma.comment.findMany({
      include: {
        author: { select: { id: true, username: true } },
        story: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteComment(id: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) throw new NotFoundException('Komentar tidak ditemukan');

    await this.prisma.comment.delete({ where: { id } });
    return { ok: true };
  }
}
