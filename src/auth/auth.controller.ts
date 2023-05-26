import { Body, Controller, Get, HttpStatus, Post, Req, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto, RegistrationDto } from "./dto/auth.dto";
import { Response, Request } from "express";
import { UsersService } from "../users/users.service";
import { TokenMapper } from "./dto/mapper/token-mapper";
import { SessionsService } from "../sessions/sessions.service";
import { ISession } from "../sessions/interface/session.interface";
import { JWT } from "../const/const";

@Controller("auth")
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
        private readonly sessionsService: SessionsService,
    ) {}

    @Post("login")
    public async login(@Body() authDto: AuthDto, @Req() req: Request, @Res() res: Response) {
        try {
            const user = await this.usersService.verifyUser(authDto);
            if (user && user.isConfirmed) {
                const sessionDevice = await this.sessionsService.generateSession(
                    req.ip,
                    req.headers["user-agent"],
                    String(user._id),
                );
                const pairTokens = await this.authService.getTokens(
                    TokenMapper.prepareAccessAndRefreshModel(user, sessionDevice),
                );

                res.cookie("refreshToken", pairTokens.refreshToken, {
                    httpOnly: true,
                    secure: true,
                    // maxAge: 24 * 60 * 60 * 1000
                });

                res.status(HttpStatus.OK).json({
                    accessToken: pairTokens.refreshToken,
                });
            }
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(HttpStatus.UNAUTHORIZED);
                console.log(error.message);
            }
        }
    }

    @Post("logout")
    public async logout(@Req() req: Request, @Res() res: Response) {
        try {
            const { refreshToken } = req.cookies;
            const payload = await this.authService.getPayloadFromToken(refreshToken);
            //todo change on search by id
            const user = await this.usersService.getUserByParam(payload.email);
            if (user) {
                await this.sessionsService.deleteTheSession(String(user._id), payload.deviceId);
                res.clearCookie("refreshToken");
                res.sendStatus(HttpStatus.NO_CONTENT);
            }
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(HttpStatus.UNAUTHORIZED);
                console.log(error.message);
            }
        }
    }

    @Post("refresh-token")
    public async updatePairTokens(@Req() req: Request, @Res() res: Response) {
        try {
            const { refreshToken } = req.cookies;
            const payload = await this.authService.getPayloadFromToken(refreshToken);
            const user = await this.usersService.getUserByParam(payload.email);
            if (user) {
                const updateSessionDevice = (await this.sessionsService.updateSession(payload.deviceId)) as ISession;
                const newPairTokens = await this.authService.getTokens(
                    TokenMapper.prepareAccessAndRefreshModel(user, updateSessionDevice),
                );
                res.cookie("refreshToken", newPairTokens.refreshToken, {
                    httpOnly: true,
                    secure: true,
                    // maxAge: 24 * 60 * 60 * 1000
                });
                res.status(HttpStatus.OK).json({
                    accessToken: newPairTokens.accessToken,
                });
            }
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(HttpStatus.UNAUTHORIZED);
                console.log(error.message);
            }
        }
    }

    @Get("me")
    public async me(@Req() req: Request, @Res() res: Response) {
        try {
            const token: string | undefined = req.headers.authorization?.split(" ")[1];
            if (token) {
                const payload = (await this.authService.getPayloadByAccessToken(token)) as JWT;
                const user = await this.usersService.getUserById(payload.id);
                res.status(HttpStatus.OK).json({
                    email: user?.email,
                    login: user?.login,
                    userId: payload.id,
                });
            }
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(HttpStatus.UNAUTHORIZED);
                console.log(error.message);
            }
        }
    }

    @Post("registration")
    public async registration(@Body() registrationDto: RegistrationDto, @Req() req: Request, @Res() res: Response) {
        try {
            await this.usersService.createByRegistration(registrationDto);

            res.sendStatus(HttpStatus.NO_CONTENT);
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(HttpStatus.BAD_REQUEST);
                console.log(error.message);
            }
        }
    }

    @Post("registration-confirmation")
    public async confirmEmail(@Body() code: string, @Res() res: Response) {
        try {
            const confirmed = await this.usersService.confirmUser(code);
            if (confirmed) {
                res.sendStatus(HttpStatus.NO_CONTENT);
            }
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(HttpStatus.BAD_REQUEST);
                console.log(error.message);
            }
        }
    }

    @Post("registration-email-resending")
    public async resendConfirm(@Body() email: string, @Res() res: Response) {
        try {
            await this.usersService.resendConfirmByUser(email);

            res.sendStatus(HttpStatus.NO_CONTENT);
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(HttpStatus.BAD_REQUEST);
                console.log(error.message);
            }
        }
    }

    @Post("password-recovery")
    public async recoveryPassword(@Body() email: string, @Res() res: Response) {
        try {
            await this.usersService.requestByRecovery(email);

            res.sendStatus(HttpStatus.NO_CONTENT);
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(HttpStatus.BAD_REQUEST);
                console.log(error.message);
            }
        }
    }

    @Post("new-password")
    public async setupNewPassword(@Body() newPassword: string, recoveryCode: string, @Res() res: Response) {
        try {
            await this.usersService.confirmNewPassword(newPassword, recoveryCode);

            res.sendStatus(HttpStatus.NO_CONTENT);
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(HttpStatus.BAD_REQUEST);
                console.log(error.message);
            }
        }
    }
}
