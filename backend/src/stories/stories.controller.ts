import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { CreateStoryDto } from './dto/create-story.dto';
import { QueryStoriesDto } from './dto/query-stories.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import { StoriesService } from './stories.service';

@Controller('stories')
export class StoriesController {
  constructor(private stories: StoriesService) {}

  @Public()
  @Get()
  findAll(@Query() query: QueryStoriesDto) {
    return this.stories.findAll(query);
  }

  @Post()
  create(@CurrentUser() user: { id: string }, @Body() dto: CreateStoryDto) {
    return this.stories.create(user.id, dto);
  }

  @Public()
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() user?: { id: string; role: string },
  ) {
    return this.stories.findOne(id, user?.id, user?.role);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: { id: string; role: string },
    @Body() dto: UpdateStoryDto,
  ) {
    return this.stories.update(id, user.id, user.role, dto);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.stories.remove(id, user.id, user.role);
  }
}
