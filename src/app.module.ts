import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogsModule } from './blogs/blogs.module';
import { PostsModule } from './posts/posts.module';


@Module({
  imports: [BlogsModule, PostsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
