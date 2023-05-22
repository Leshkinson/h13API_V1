import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { BlogsModule } from "./blogs/blogs.module";
import { PostsModule } from "./posts/posts.module";
import { UsersModule } from "./users/users.module";
import {DatabaseModule} from "./database/database.module";
import { CommentsModule } from './comments/comments.module';

@Module({
    imports: [BlogsModule, PostsModule, UsersModule, DatabaseModule, CommentsModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
