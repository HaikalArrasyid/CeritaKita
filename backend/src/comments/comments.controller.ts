import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('stories/:id/comments')
export class CommentsController {
  constructor(private comments: CommentsService) {}

  @Get()
  listForStory(@Param('id') id: string) {
    return this.comments.listForStory(id);
  }

  @Post()
  create(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
    @Body() dto: CreateCommentDto,
  ) {
    return this.comments.create(id, user.id, dto.content);
  }
}
