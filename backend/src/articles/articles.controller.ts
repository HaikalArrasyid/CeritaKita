import { Controller, Get, Param } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { ArticlesService } from './articles.service';

@Controller('articles')
export class ArticlesController {
  constructor(private articles: ArticlesService) {}

  @Public()
  @Get('feed')
  async getFeed() {
    const articles = await this.articles.getJsonArticles();
    return articles.reverse(); // Latest first
  }

  @Public()
  @Get()
  findAll() {
    return this.articles.findAll();
  }

  @Public()
  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.articles.findBySlug(slug);
  }
}
