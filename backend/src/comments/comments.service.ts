import { Injectable, NotFoundException } from '@nestjs/common';
import { ModerationService } from '../moderation/moderation.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(
    private prisma: PrismaService,
    private moderation: ModerationService,
  ) {}

  async listForStory(storyId: string) {
    const story = await this.prisma.story.findUnique({
      where: { id: storyId },
    });
    if (!story || story.status !== 'PUBLISHED') {
      throw new NotFoundException('Cerita tidak ditemukan');
    }
    const comments = await this.prisma.comment.findMany({
      where: { storyId, status: 'PUBLISHED' },
      include: { author: { select: { id: true, username: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return comments.map((c) => ({
      id: c.id,
      content: c.content,
      displayName: c.author.username,
      createdAt: c.createdAt,
    }));
  }

  async create(storyId: string, userId: string, content: string) {
    const story = await this.prisma.story.findUnique({
      where: { id: storyId },
    });
    if (!story || story.status !== 'PUBLISHED') {
      throw new NotFoundException('Cerita tidak ditemukan');
    }
    const flagged = await this.moderation.isFlagged(content);
    
    let requireManualReview = false;
    const setting = await this.prisma.systemSetting.findUnique({
      where: { key: 'REQUIRE_MANUAL_REVIEW' }
    });
    if (setting && setting.value === 'true') {
      requireManualReview = true;
    }

    return this.prisma.comment.create({
      data: {
        storyId,
        authorId: userId,
        content,
        status: flagged || requireManualReview ? 'PENDING' : 'PUBLISHED',
      },
    });
  }
}
