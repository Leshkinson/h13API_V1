import { JWT } from "../const/const";
import { Request, Response } from "express";
import { AuthService } from "../auth/auth.service";
import { SessionsService } from "./sessions.service";
import { RefreshGuard } from "../auth/refresh.guard";
import { UsersService } from "../users/users.service";
import { RequestWithUser } from "../auth/interface/auth.interface";
import { Controller, Get, Param, Delete, Req, Res, HttpStatus, UseGuards } from "@nestjs/common";

@Controller("security")
export class SessionsController {
    constructor(
        private readonly sessionsService: SessionsService,
        private readonly usersService: UsersService,
        private readonly authService: AuthService,
    ) {}
    @UseGuards(RefreshGuard)
    @Get("devices")
    async getAllDevices(@Req() req: Request, @Res() res: Response) {
        try {
            console.log("req.path", req.path);
            const request = req as RequestWithUser;
            const { email } = request.user;
            const user = await this.usersService.getUserByParam(email);
            if (user) {
                const sessions = await this.sessionsService.getAllSessionByUser(String(user._id));
                res.status(HttpStatus.OK).json(sessions);
            }
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(HttpStatus.UNAUTHORIZED);
                console.log(error.message);
            }
        }
    }
    //@UseGuards(RefreshGuard)
    @Delete("devices")
    async terminateDevicesSession(@Req() req: Request, @Res() res: Response) {
        try {
            console.log("req.path", req.path);
            const request = req as RequestWithUser;
            //const { email, deviceId } = request.user;
            const { refreshToken } = request.cookies;
            console.log("refreshToken", refreshToken);
            const payload = await this.authService.getPayloadFromToken(refreshToken);
            console.log("payload", payload);
            if (!payload.email && !payload.deviceId) {
                res.sendStatus(HttpStatus.FORBIDDEN);

                return;
            }
            const user = await this.usersService.getUserByParam(payload.email);
            if (user) {
                await this.sessionsService.deleteSessionWithExcept(String(user._id), payload.deviceId);
                res.sendStatus(HttpStatus.NO_CONTENT);
            }
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(HttpStatus.UNAUTHORIZED);
                console.log(error.message);
            }
        }
    }
    @Delete("devices/:deviceId")
    async terminateTheDeviceSession(@Param("deviceId") deviceId: string, @Req() req: Request, @Res() res: Response) {
        try {
            console.log("req.path", req.path);
            const { deviceId } = req.params;
            //console.log("deviceId", deviceId);
            const { refreshToken } = req.cookies;
            console.log("refreshToken", refreshToken);
            if (!refreshToken) {
                res.sendStatus(HttpStatus.UNAUTHORIZED);

                return;
            }
            const isBlockedToken = await this.authService.checkTokenByBlackList(refreshToken);
            console.log("isBlockedToken", isBlockedToken);
            if (!isBlockedToken) {
                res.sendStatus(HttpStatus.UNAUTHORIZED);

                return;
            }
            const payload = (await this.authService.getPayloadByRefreshToken(refreshToken)) as JWT;
            console.log("payload", payload);
            if (!payload) {
                res.sendStatus(HttpStatus.FORBIDDEN);

                return;
            }
            const user = await this.usersService.getUserByParam(payload.email);
            console.log("user", user);
            if (!user) throw new Error();
            const session = await this.sessionsService.findSession(deviceId);
            console.log("session", session);
            if (!session) throw new Error();
            if (session.userId !== String(user._id)) {
                res.sendStatus(HttpStatus.FORBIDDEN);

                return;
            }
            await this.sessionsService.deleteTheSession(String(user._id), deviceId);
            res.sendStatus(HttpStatus.NO_CONTENT);
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(HttpStatus.NOT_FOUND);
                console.log(error.message);
            }
        }
    }
}
