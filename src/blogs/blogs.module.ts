import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { BlogsService } from "./blogs.service";
import { blogsProviders } from "./blogs.providers";
import { AuthService } from "../auth/auth.service";
import { BlogsController } from "./blogs.controller";
import { BlogsRepository } from "./blogs.repository";
import { postsProviders } from "../posts/posts.providers";
import { usersProviders } from "../users/users.providers";
import { PostsRepository } from "../posts/posts.repository";
import { UsersRepository } from "../users/users.repository";
import { DatabaseModule } from "../database/database.module";
import { SessionsService } from "../sessions/sessions.service";
import { sessionsProviders } from "../sessions/sessions.providers";
import { QueryService } from "../sup-services/query/query.service";
import { commentsProviders } from "../comments/comments.providers";
import { CommentsRepository } from "../comments/comments.repository";
import { SessionsRepository } from "../sessions/sessions.repository";
import { likesProviders } from "../sup-services/query/like.providers";
import { LikesRepository } from "../sup-services/query/like.repository";

@Module({
    imports: [DatabaseModule],
    controllers: [BlogsController],
    providers: [
        BlogsService,
        QueryService,
        AuthService,
        JwtService,
        SessionsService,
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
        {
            provide: "sessionRepository",
            useValue: SessionsRepository,
        },
        ...blogsProviders,
        ...likesProviders,
        ...postsProviders,
        ...usersProviders,
        ...commentsProviders,
        ...sessionsProviders,
    ],
    exports: [BlogsService],
})
export class BlogsModule {}
