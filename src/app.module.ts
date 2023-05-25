import { Module } from "@nestjs/common";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { AppController } from "./app.controller";
import { UsersModule } from "./users/users.module";
import { BlogsModule } from "./blogs/blogs.module";
import { PostsModule } from "./posts/posts.module";
import { DatabaseModule } from "./database/database.module";
import { CommentsModule } from "./comments/comments.module";
import { SessionsModule } from "./sessions/sessions.module";

@Module({
    imports: [BlogsModule, PostsModule, DatabaseModule, CommentsModule, SessionsModule, AuthModule, UsersModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
