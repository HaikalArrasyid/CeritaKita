import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs/promises';
import * as path from 'path';

export interface JsonArticle {
  id: string;
  label: string;
  title: string;
  excerpt: string;
  createdAt: string;
}

@Injectable()
export class ArticlesService {
  private readonly logger = new Logger(ArticlesService.name);
  private readonly jsonPath = path.join(process.cwd(), 'data', 'edukasi.json');

  constructor(private prisma: PrismaService) {
    this.ensureJsonFile();
  }

  private async ensureJsonFile() {
    try {
      await fs.mkdir(path.dirname(this.jsonPath), { recursive: true });
      try {
        await fs.access(this.jsonPath);
      } catch {
        // Create initial default data
        const initialData: JsonArticle[] = [
          {
            id: 'init-1',
            label: 'MENGENALI BIAS',
            title: 'Bias gender tidak selalu terdengar keras',
            excerpt: 'Bias bisa hadir dalam asumsi kecil: siapa yang dianggap lebih mampu memimpin, siapa yang diminta mencatat, atau siapa yang diharapkan selalu mengalah.',
            createdAt: new Date().toISOString()
          },
          {
            id: 'init-2',
            label: 'MENJADI SEKUTU',
            title: 'Tiga cara merespons cerita dengan empati',
            excerpt: 'Dengarkan sampai selesai, validasi pengalaman tanpa membandingkan, lalu tanyakan dukungan seperti apa yang dibutuhkan.',
            createdAt: new Date().toISOString()
          },
          {
            id: 'init-3',
            label: 'DATA KESETARAAN',
            title: 'Ruang aman dibangun bersama',
            excerpt: 'Kesetaraan tumbuh dari kebiasaan sehari-hari: memberi ruang bicara yang seimbang, membagi kerja yang tidak terlihat, dan berani menegur candaan.',
            createdAt: new Date().toISOString()
          }
        ];
        await fs.writeFile(this.jsonPath, JSON.stringify(initialData, null, 2), 'utf-8');
      }
    } catch (e) {
      this.logger.error('Gagal memastikan file edukasi.json', e);
    }
  }

  async getJsonArticles(): Promise<JsonArticle[]> {
    try {
      const content = await fs.readFile(this.jsonPath, 'utf-8');
      return JSON.parse(content);
    } catch (e) {
      return [];
    }
  }

  async appendJsonArticle(article: JsonArticle) {
    const articles = await this.getJsonArticles();
    articles.push(article);
    // Keep only the latest 100 to prevent infinite growth
    if (articles.length > 100) articles.shift();
    await fs.writeFile(this.jsonPath, JSON.stringify(articles, null, 2), 'utf-8');
  }

  findAll() {
    return this.prisma.article.findMany({
      where: { published: true },
      select: {
        id: true,
        title: true,
        slug: true,
        summary: true,
        coverImage: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findBySlug(slug: string) {
    const article = await this.prisma.article.findUnique({ where: { slug } });
    if (!article || !article.published) {
      throw new NotFoundException('Artikel tidak ditemukan');
    }
    return article;
  }
}
