import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookmarksService {
  constructor(private prisma: PrismaService) {}

  private async assertStory(storyId: string) {
    const story = await this.prisma.story.findUnique({
      where: { id: storyId },
    });
    if (!story) {
      throw new NotFoundException('Cerita tidak ditemukan');
    }
  }

  async toggle(storyId: string, userId: string) {
    await this.assertStory(storyId);
    const existing = await this.prisma.bookmark.findUnique({
      where: { userId_storyId: { userId, storyId } },
    });
    if (existing) {
      await this.prisma.bookmark.delete({ where: { id: existing.id } });
      return { bookmarked: false };
    }
    await this.prisma.bookmark.create({ data: { userId, storyId } });
    return { bookmarked: true };
  }
}
