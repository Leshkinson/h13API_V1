import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, HttpStatus } from "@nestjs/common";
import { SessionsService } from "./sessions.service";
import { CreateSessionDto } from "./dto/create-session.dto";
import { UpdateSessionDto } from "./dto/update-session.dto";
import { Request, Response } from "express";
import { UsersService } from "../users/users.service";

@Controller("session")
export class SessionsController {
    constructor(private readonly sessionsService: SessionsService, private readonly usersService: UsersService) {}

    @Get()
    async getAllDevices(@Req() req: Request, @Res() res: Response) {
        try {
            const { refreshToken } = req.cookies;
            const payload = await tokenService.getPayloadFromToken(refreshToken);
            const user = await this.usersService.getUserByParam(payload.email);
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

    @Delete(":id")
    async terminateDevicesSession(@Req() req: Request, @Res() res: Response) {
        try {
            const { refreshToken } = req.cookies;

            const payload = await tokenService.getPayloadFromToken(refreshToken);
            if (!payload) {
                res.sendStatus(403);

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
    @Delete(":id")
    async terminateTheDeviceSession(@Param("deviceId") deviceId: string, @Req() req: Request, @Res() res: Response) {
        try {
            // const userService = new UserService();
            // const tokenService = new TokenService();
            // const sessionService = new SessionService();

            const { deviceId } = req.params;
            const { refreshToken } = req.cookies;
            if (!refreshToken) {
                res.sendStatus(HttpStatus.UNAUTHORIZED);

                return;
            }
            const isBlockedToken = await tokenService.checkTokenByBlackList(refreshToken);
            if (isBlockedToken) {
                res.sendStatus(HttpStatus.UNAUTHORIZED);

                return;
            }
            const payload = (await tokenService.getPayloadByRefreshToken(refreshToken)) as JWT;
            if (!payload) {
                res.sendStatus(HttpStatus.FORBIDDEN);

                return;
            }
            const user = await this.usersService.getUserByParam(payload.email);
            if (!user) throw new Error();
            const session = await this.sessionsService.findSession(deviceId);
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
