import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { ReactionsService } from './reactions.service';

@Controller('stories/:id/reactions')
export class ReactionsController {
  constructor(private reactions: ReactionsService) {}

  @Post()
  @HttpCode(200)
  toggle(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
    @Body() dto: CreateReactionDto,
  ) {
    return this.reactions.toggle(id, user.id, dto.type);
  }

  @Delete()
  @HttpCode(200)
  remove(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.reactions.remove(id, user.id);
  }
}
