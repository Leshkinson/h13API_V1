import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UsersService } from "../users/users.service";
import { SessionsService } from "../sessions/sessions.service";
import { JwtModule } from "@nestjs/jwt";
import { AccessTokenStrategy } from "./strategies/accessToken.strategy";
import { RefreshTokenStrategy } from "./strategies/refreshToken.strategy";
import { UsersRepository } from "../users/users.repository";
import { usersProviders } from "../users/users.providers";
import { SessionsRepository } from "../sessions/sessions.repository";
import { sessionsProviders } from "../sessions/sessions.providers";
import { DatabaseModule } from "../database/database.module";
import { MailService } from "../sup-services/application/mailer/mail.service";
import { MAILER_OPTIONS, MailerService } from "@nestjs-modules/mailer";

@Module({
    imports: [DatabaseModule, JwtModule.register({})],
    controllers: [AuthController],
    providers: [
        AuthService,
        UsersService,
        SessionsService,
        AccessTokenStrategy,
        RefreshTokenStrategy,
        MailService,
        MailerService,
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
        ...usersProviders,
        ...sessionsProviders,
    ],
})
export class AuthModule {}
