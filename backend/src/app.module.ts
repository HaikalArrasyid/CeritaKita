import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticlesModule } from './articles/articles.module';
import { AuthModule } from './auth/auth.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { CommentsModule } from './comments/comments.module';
import { MailModule } from './mail/mail.module';
import { ModerationModule } from './moderation/moderation.module';
import { PrismaModule } from './prisma/prisma.module';
import { ReactionsModule } from './reactions/reactions.module';
import { ReportsModule } from './reports/reports.module';
import { StoriesModule } from './stories/stories.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 60 }]),
    ScheduleModule.forRoot(),
    PrismaModule,
    MailModule,
    ModerationModule,
    AuthModule,
    UsersModule,
    StoriesModule,
    CommentsModule,
    ReactionsModule,
    BookmarksModule,
    ReportsModule,
    ArticlesModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
