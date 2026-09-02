import {
  Body,
  ConflictException,
  Controller,
  Get,
  Patch,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UsersService } from './users.service';

@Controller('profile')
export class ProfileController {
  constructor(
    private prisma: PrismaService,
    private users: UsersService,
  ) {}

  @Get()
  async me(
    @CurrentUser()
    user: {
      id: string;
      username: string;
      email: string;
      role: string;
    },
  ) {
    const [storiesCount, bookmarksCount] = await Promise.all([
      this.prisma.story.count({ where: { authorId: user.id } }),
      this.prisma.bookmark.count({ where: { userId: user.id } }),
    ]);
    return {
      user,
      counts: { stories: storiesCount, bookmarks: bookmarksCount },
    };
  }

  @Get('stories')
  async myStories(@CurrentUser() user: { id: string }) {
    const stories = await this.prisma.story.findMany({
      where: { authorId: user.id },
      include: {
        author: { select: { id: true, username: true } },
        reactions: { select: { type: true, userId: true } },
        bookmarks: { where: { userId: user.id } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return stories.map((s) => ({
      id: s.id,
      title: s.title,
      category: s.category,
      contentPreview:
        s.content.length > 160 ? `${s.content.slice(0, 160)}…` : s.content,
      content: s.content,
      isAnonymous: s.isAnonymous,
      displayName: s.isAnonymous
        ? `Anonim #${s.authorId.slice(0, 6)}`
        : s.author.username,
      reactionCounts: {
        relate: s.reactions.filter((r) => r.type === 'RELATE').length,
        support: s.reactions.filter((r) => r.type === 'SUPPORT').length,
      },
      isBookmarked: s.bookmarks.length > 0,
      hasSupported: s.reactions.some((r) => r.type === 'SUPPORT' && r.userId === user.id),
      createdAt: s.createdAt,
      status: s.status,
    }));
  }

  @Get('bookmarks')
  async myBookmarks(@CurrentUser() user: { id: string }) {
    const bookmarks = await this.prisma.bookmark.findMany({
      where: { userId: user.id },
      include: {
        story: {
          include: { 
            author: { select: { id: true, username: true } },
            reactions: { select: { type: true, userId: true } }
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return bookmarks.map((b) => {
      const s = b.story;
      return {
        id: s.id,
        title: s.title,
        category: s.category,
        contentPreview:
          s.content.length > 160 ? `${s.content.slice(0, 160)}…` : s.content,
        content: s.content,
        isAnonymous: s.isAnonymous,
        displayName: s.isAnonymous
          ? `Anonim #${s.authorId.slice(0, 6)}`
          : s.author.username,
        reactionCounts: {
          relate: s.reactions.filter((r) => r.type === 'RELATE').length,
          support: s.reactions.filter((r) => r.type === 'SUPPORT').length,
        },
        isBookmarked: true,
        hasSupported: s.reactions.some((r) => r.type === 'SUPPORT' && r.userId === user.id),
        createdAt: s.createdAt,
        status: s.status,
      };
    });
  }

  @Patch()
  async update(
    @CurrentUser() user: { id: string },
    @Body() dto: UpdateProfileDto,
  ) {
    if (dto.username) {
      const existing = await this.users.findByUsername(dto.username);
      if (existing && existing.id !== user.id) {
        throw new ConflictException('Username sudah digunakan');
      }
    }
    const updated = await this.prisma.user.update({
      where: { id: user.id },
      data: dto.username ? { username: dto.username } : {},
    });
    return {
      id: updated.id,
      username: updated.username,
      email: updated.email,
      role: updated.role,
    };
  }

  @Patch('password')
  async updatePassword(
    @CurrentUser() user: { id: string },
    @Body() dto: UpdatePasswordDto,
  ) {
    const userRecord = await this.users.findById(user.id);
    if (!userRecord) {
      throw new BadRequestException('Pengguna tidak ditemukan');
    }

    const ok = await bcrypt.compare(dto.oldPassword, userRecord.passwordHash);
    if (!ok) {
      throw new BadRequestException('Kata sandi lama tidak sesuai');
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, 10);
    await this.users.updatePassword(user.id, passwordHash);

    return { ok: true, message: 'Kata sandi berhasil diperbarui' };
  }
}
