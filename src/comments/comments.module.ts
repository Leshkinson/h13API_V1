import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "../auth/auth.service";
import { CommentsService } from "./comments.service";
import { commentsProviders } from "./comments.providers";
import { postsProviders } from "../posts/posts.providers";
import { blogsProviders } from "../blogs/blogs.providers";
import { usersProviders } from "../users/users.providers";
import { CommentsController } from "./comments.controller";
import { CommentsRepository } from "./comments.repository";
import { PostsRepository } from "../posts/posts.repository";
import { UsersRepository } from "../users/users.repository";
import { BlogsRepository } from "../blogs/blogs.repository";
import { DatabaseModule } from "../database/database.module";
import { SessionsService } from "../sessions/sessions.service";
import { sessionsProviders } from "../sessions/sessions.providers";
import { QueryService } from "../sup-services/query/query.service";
import { SessionsRepository } from "../sessions/sessions.repository";
import { likesProviders } from "../sup-services/query/like.providers";
import { LikesRepository } from "../sup-services/query/like.repository";
import { UsersService } from "../users/users.service";
import { MailService } from "../sup-services/application/mailer/mail.service";
import { MAILER_OPTIONS, MailerService } from "@nestjs-modules/mailer";

@Module({
    imports: [DatabaseModule],
    controllers: [CommentsController],
    providers: [
        CommentsService,
        UsersService,
        QueryService,
        AuthService,
        JwtService,
        SessionsService,
        MailService,
        MailerService,
        {
            provide: "blogRepository",
            useValue: BlogsRepository,
        },
        {
            provide: "commentRepository",
            useValue: CommentsRepository,
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
            provide: "sessionRepository",
            useValue: SessionsRepository,
        },
        {
            provide: `${MAILER_OPTIONS}`,
            useExisting: MailerService,
        },
        ...blogsProviders,
        ...likesProviders,
        ...postsProviders,
        ...usersProviders,
        ...commentsProviders,
        ...sessionsProviders,
    ],
})
export class CommentsModule {}
