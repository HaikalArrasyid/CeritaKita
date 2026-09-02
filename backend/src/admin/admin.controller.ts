import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { AdminService } from './admin.service';
import { AdminCreateUserDto } from './dto/admin-create-user.dto';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';
import { CreateBannedWordDto } from './dto/create-banned-word.dto';
import { ResolveReportDto } from './dto/resolve-report.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Controller('admin')
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private admin: AdminService) {}

  @Get('settings')
  getSettings() {
    return this.admin.getSettings();
  }

  @Patch('settings')
  updateSetting(@Body() dto: { key: string; value: string }) {
    return this.admin.updateSetting(dto.key, dto.value);
  }

  @Get('reports')
  listReports() {
    return this.admin.listReports();
  }

  @Patch('reports/:id')
  resolveReport(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
    @Body() dto: ResolveReportDto,
  ) {
    return this.admin.resolveReport(id, dto.action, user.id);
  }

  @Get('moderation')
  listModeration() {
    return this.admin.listModeration();
  }

  @Patch('stories/:id/status')
  updateStoryStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.admin.updateStoryStatus(id, dto.status);
  }

  @Patch('comments/:id/status')
  updateCommentStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.admin.updateCommentStatus(id, dto.status);
  }

  @Get('analytics')
  analytics() {
    return this.admin.analytics();
  }

  @Get('banned-words')
  listBannedWords() {
    return this.admin.listBannedWords();
  }

  @Post('banned-words')
  addBannedWord(@Body() dto: CreateBannedWordDto) {
    return this.admin.addBannedWord(dto.word);
  }

  @Delete('banned-words/:id')
  removeBannedWord(@Param('id') id: string) {
    return this.admin.removeBannedWord(id);
  }

  // --- Users CRUD ---

  @Get('users')
  listUsers() {
    return this.admin.listUsers();
  }

  @Post('users')
  createUser(@Body() dto: AdminCreateUserDto) {
    return this.admin.createUser(dto);
  }

  @Patch('users/:id')
  updateUser(@Param('id') id: string, @Body() dto: AdminUpdateUserDto) {
    return this.admin.updateUser(id, dto);
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    return this.admin.deleteUser(id);
  }

  // --- Stories CRUD ---

  @Get('stories')
  listStories() {
    return this.admin.listStories();
  }

  @Post('stories')
  createStory(
    @CurrentUser() user: { id: string },
    @Body() dto: any,
  ) {
    return this.admin.createStory(user.id, dto);
  }

  @Patch('stories/:id')
  updateStory(@Param('id') id: string, @Body() dto: any) {
    return this.admin.updateStory(id, dto);
  }

  @Delete('stories/:id')
  deleteStory(@Param('id') id: string) {
    return this.admin.deleteStory(id);
  }

  // --- Articles CRUD ---

  @Get('articles')
  listArticles() {
    return this.admin.listArticles();
  }

  @Post('articles')
  createArticle(@Body() dto: any) {
    return this.admin.createArticle(dto);
  }

  @Patch('articles/:id')
  updateArticle(@Param('id') id: string, @Body() dto: any) {
    return this.admin.updateArticle(id, dto);
  }

  @Delete('articles/:id')
  deleteArticle(@Param('id') id: string) {
    return this.admin.deleteArticle(id);
  }

  // --- Comments CRUD ---

  @Get('comments')
  listComments() {
    return this.admin.listComments();
  }

  @Delete('comments/:id')
  deleteComment(@Param('id') id: string) {
    return this.admin.deleteComment(id);
  }
}
