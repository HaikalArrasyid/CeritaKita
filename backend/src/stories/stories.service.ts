import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Category, Prisma } from '@prisma/client';
import { ModerationService } from '../moderation/moderation.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';

const CATEGORY_LABELS: Record<string, Category> = {
  'Lingkungan Kerja': Category.WORK,
  Pendidikan: Category.SCHOOL,
  'Rumah Tangga': Category.HOME,
  'Ruang Publik': Category.PUBLIC_SPACE,
  'Media Sosial': Category.SOCIAL_MEDIA,
  Lainnya: Category.OTHER,
};

@Injectable()
export class StoriesService {
  constructor(
    private prisma: PrismaService,
    private moderation: ModerationService,
  ) {}

  private displayName(story: {
    isAnonymous: boolean;
    authorId: string;
    author: { username: string };
  }): string {
    return story.isAnonymous
      ? `Anonim #${story.authorId.slice(0, 6)}`
      : story.author.username;
  }

  private resolveCategory(input?: string): Category | undefined {
    if (!input) return undefined;
    if (Object.values(Category).includes(input as Category)) {
      return input as Category;
    }
    return CATEGORY_LABELS[input];
  }

  async findAll(query: {
    category?: string;
    search?: string;
    sort?: string;
    page?: number;
    limit?: number;
  }) {
    const where: Prisma.StoryWhereInput = { status: 'PUBLISHED' };

    const category = this.resolveCategory(query.category);
    if (category) {
      where.category = category;
    }
    if (query.search) {
      where.OR = [
        { title: { contains: query.search } },
        { content: { contains: query.search } },
      ];
    }

    const stories = await this.prisma.story.findMany({
      where,
      include: {
        author: { select: { id: true, username: true } },
        reactions: { select: { type: true } },
        comments: { where: { status: 'PUBLISHED' }, select: { id: true } },
      },
    });

    const mapped = stories.map((s) => ({
      id: s.id,
      title: s.title,
      category: s.category,
      contentPreview:
        s.content.length > 160 ? `${s.content.slice(0, 160)}…` : s.content,
      isAnonymous: s.isAnonymous,
      displayName: this.displayName(s),
      reactionCounts: {
        relate: s.reactions.filter((r) => r.type === 'RELATE').length,
        support: s.reactions.filter((r) => r.type === 'SUPPORT').length,
      },
      commentCount: s.comments.length,
      createdAt: s.createdAt,
    }));

    const sort = query.sort ?? 'newest';
    if (sort === 'trending') {
      mapped.sort(
        (a, b) =>
          b.reactionCounts.relate +
          b.reactionCounts.support -
          (a.reactionCounts.relate + a.reactionCounts.support),
      );
    } else if (sort === 'supportive') {
      mapped.sort(
        (a, b) => b.reactionCounts.support - a.reactionCounts.support,
      );
    } else {
      mapped.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    }

    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const total = mapped.length;
    const data = mapped.slice((page - 1) * limit, page * limit);

    return { data, meta: { page, limit, total } };
  }

  async create(userId: string, dto: CreateStoryDto) {
    const flagged = await this.moderation.isFlagged(
      `${dto.title} ${dto.content}`,
    );
    
    let requireManualReview = false;
    const setting = await this.prisma.systemSetting.findUnique({
      where: { key: 'REQUIRE_MANUAL_REVIEW' }
    });
    if (setting && setting.value === 'true') {
      requireManualReview = true;
    }

    return this.prisma.story.create({
      data: {
        authorId: userId,
        title: dto.title,
        category: dto.category,
        content: dto.content,
        isAnonymous: dto.isAnonymous ?? false,
        status: flagged || requireManualReview ? 'PENDING' : 'PUBLISHED',
      },
    });
  }

  async findOne(id: string, userId?: string, role?: string) {
    const story = await this.prisma.story.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, username: true } },
        reactions: { select: { type: true } },
        comments: {
          where: { status: 'PUBLISHED' },
          include: { author: { select: { id: true, username: true } } },
          orderBy: { createdAt: 'desc' },
        },
        bookmarks: userId ? { where: { userId } } : false,
      },
    });

    if (!story) {
      throw new NotFoundException('Cerita tidak ditemukan');
    }
    if (
      story.status !== 'PUBLISHED' &&
      story.authorId !== userId &&
      role !== 'ADMIN'
    ) {
      throw new NotFoundException('Cerita tidak ditemukan');
    }

    return {
      id: story.id,
      authorId: story.authorId,
      title: story.title,
      category: story.category,
      content: story.content,
      isAnonymous: story.isAnonymous,
      displayName: this.displayName(story),
      status: story.status,
      isBookmarked: story.bookmarks ? story.bookmarks.length > 0 : false,
      reactionCounts: {
        relate: story.reactions.filter((r) => r.type === 'RELATE').length,
        support: story.reactions.filter((r) => r.type === 'SUPPORT').length,
      },
      comments: story.comments.map((c) => ({
        id: c.id,
        content: c.content,
        displayName: c.author.username,
        createdAt: c.createdAt,
      })),
      createdAt: story.createdAt,
    };
  }


  async update(id: string, userId: string, role: string, dto: UpdateStoryDto) {
    const story = await this.prisma.story.findUnique({ where: { id } });
    if (!story) {
      throw new NotFoundException('Cerita tidak ditemukan');
    }
    if (story.authorId !== userId && role !== 'ADMIN') {
      throw new ForbiddenException('Anda tidak dapat mengubah cerita ini');
    }

    const mergedContent = dto.content ?? story.content;
    const mergedTitle = dto.title ?? story.title;
    const flagged = await this.moderation.isFlagged(
      `${mergedTitle} ${mergedContent}`,
    );

    let requireManualReview = false;
    const setting = await this.prisma.systemSetting.findUnique({
      where: { key: 'REQUIRE_MANUAL_REVIEW' }
    });
    if (setting && setting.value === 'true') {
      requireManualReview = true;
    }

    return this.prisma.story.update({
      where: { id },
      data: {
        title: mergedTitle,
        category: dto.category ?? story.category,
        content: mergedContent,
        isAnonymous: dto.isAnonymous ?? story.isAnonymous,
        status: flagged || requireManualReview ? 'PENDING' : 'PUBLISHED',
      },
    });
  }

  async remove(id: string, userId: string, role: string) {
    const story = await this.prisma.story.findUnique({ where: { id } });
    if (!story) {
      throw new NotFoundException('Cerita tidak ditemukan');
    }
    if (story.authorId !== userId && role !== 'ADMIN') {
      throw new ForbiddenException('Anda tidak dapat menghapus cerita ini');
    }
    await this.prisma.story.delete({ where: { id } });
    return { ok: true };
  }
}
