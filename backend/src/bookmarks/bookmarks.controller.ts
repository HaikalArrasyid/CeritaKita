import { Controller, Delete, HttpCode, Param, Post } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { BookmarksService } from './bookmarks.service';

@Controller('stories/:id/bookmark')
export class BookmarksController {
  constructor(private bookmarks: BookmarksService) {}

  @Post()
  @HttpCode(200)
  add(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.bookmarks.toggle(id, user.id);
  }

  @Delete()
  @HttpCode(200)
  remove(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.bookmarks.toggle(id, user.id);
  }
}
