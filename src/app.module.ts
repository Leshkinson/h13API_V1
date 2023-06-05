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
import { QueryService } from "./sup-services/query/query.service";
import { BlogsRepository } from "./blogs/blogs.repository";
import { PostsRepository } from "./posts/posts.repository";
import { LikesRepository } from "./sup-services/query/like.repository";
import { UsersRepository } from "./users/users.repository";
import { CommentsRepository } from "./comments/comments.repository";

@Module({
    imports: [BlogsModule, PostsModule, DatabaseModule, CommentsModule, SessionsModule, AuthModule, UsersModule],
    controllers: [AppController],
    providers: [
        AppService,
        QueryService,
        {
            provide: "blogRepository",
            useValue: BlogsRepository,
        },
        {
            provide: "postRepository",
            useValue: PostsRepository,
        },
        {
            provide: "likeRepository",
            useValue: LikesRepository,
        },
        {
            provide: "userRepository",
            useValue: UsersRepository,
        },
        {
            provide: "commentRepository",
            useValue: CommentsRepository,
        },
    ],
})
export class AppModule {}
