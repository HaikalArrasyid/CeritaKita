import { Injectable, NotFoundException } from '@nestjs/common';
import { ReactionType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReactionsService {
  constructor(private prisma: PrismaService) {}

  private async assertStory(storyId: string) {
    const story = await this.prisma.story.findUnique({
      where: { id: storyId },
    });
    if (!story || story.status !== 'PUBLISHED') {
      throw new NotFoundException('Cerita tidak ditemukan');
    }
  }

  private async counts(storyId: string) {
    const reactions = await this.prisma.reaction.findMany({
      where: { storyId },
      select: { type: true },
    });
    return {
      relate: reactions.filter((r) => r.type === 'RELATE').length,
      support: reactions.filter((r) => r.type === 'SUPPORT').length,
    };
  }

  async toggle(storyId: string, userId: string, type: ReactionType) {
    await this.assertStory(storyId);
    const existing = await this.prisma.reaction.findUnique({
      where: { storyId_userId: { storyId, userId } },
    });

    if (existing && existing.type === type) {
      await this.prisma.reaction.delete({ where: { id: existing.id } });
    } else if (existing) {
      await this.prisma.reaction.update({
        where: { id: existing.id },
        data: { type },
      });
    } else {
      await this.prisma.reaction.create({
        data: { storyId, userId, type },
      });
    }
    return this.counts(storyId);
  }

  async remove(storyId: string, userId: string) {
    await this.assertStory(storyId);
    await this.prisma.reaction.deleteMany({ where: { storyId, userId } });
    return this.counts(storyId);
  }
}
