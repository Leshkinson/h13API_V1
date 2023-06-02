import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UsersService } from "../users/users.service";
import { SessionsService } from "../sessions/sessions.service";
import { JwtModule } from "@nestjs/jwt";
import { AccessStrategy } from "./strategies/accessToken.strategy";
import { RefreshTokenStrategy } from "./strategies/refreshToken.strategy";
import { UsersRepository } from "../users/users.repository";
import { usersProviders } from "../users/users.providers";
import { SessionsRepository } from "../sessions/sessions.repository";
import { sessionsProviders } from "../sessions/sessions.providers";
import { DatabaseModule } from "../database/database.module";
import { MailService } from "../sup-services/application/mailer/mail.service";
import { MAILER_OPTIONS, MailerService } from "@nestjs-modules/mailer";
import { MailModule } from "../sup-services/application/mailer/mail.module";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { SETTINGS_TOKEN } from "../const/const";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { APP_GUARD } from "@nestjs/core";

@Module({
    imports: [
        DatabaseModule,
        MailModule,
        PassportModule,
        JwtModule.register({ secret: SETTINGS_TOKEN.JWT_ACCESS_SECRET, signOptions: { expiresIn: "60s" } }),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        UsersService,
        SessionsService,
        AccessStrategy,
        JwtStrategy,
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
        // {
        //     provide: APP_GUARD,
        //     useClass: JwtAuthGuard,
        // },
        ...usersProviders,
        ...sessionsProviders,
    ],
})
export class AuthModule {}
