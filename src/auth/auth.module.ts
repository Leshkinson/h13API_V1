import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { SETTINGS_TOKEN } from "../const/const";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { UsersService } from "../users/users.service";
import { usersProviders } from "../users/users.providers";
import { UsersRepository } from "../users/users.repository";
import { DatabaseModule } from "../database/database.module";
import { SessionsService } from "../sessions/sessions.service";
import { AccessStrategy } from "./strategies/accessToken.strategy";
import { sessionsProviders } from "../sessions/sessions.providers";
import { SessionsRepository } from "../sessions/sessions.repository";
import { MAILER_OPTIONS, MailerService } from "@nestjs-modules/mailer";
import { RefreshTokenStrategy } from "./strategies/refreshToken.strategy";
import { MailModule } from "../sup-services/application/mailer/mail.module";
import { MailService } from "../sup-services/application/mailer/mail.service";

@Module({
    imports: [
        DatabaseModule,
        MailModule,
        PassportModule,
        JwtModule.register({ secret: SETTINGS_TOKEN.JWT_REFRESH_SECRET, signOptions: { expiresIn: "60s" } }),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        UsersService,
        SessionsService,
        AccessStrategy,
        RefreshTokenStrategy,
        MailService,
        {
            provide: "userRepository",
            useClass: UsersRepository,
        },
        {
            provide: "sessionRepository",
            useClass: SessionsRepository,
        },
        {
            provide: `${MAILER_OPTIONS}`,
            useExisting: MailerService,
        },
        ...usersProviders,
        ...sessionsProviders,
    ],
    exports: [AuthService],
})
export class AuthModule {}
