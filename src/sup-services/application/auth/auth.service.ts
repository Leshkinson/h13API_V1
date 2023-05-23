import { Injectable } from "@nestjs/common";
import { JwtService, JwtVerifyOptions } from "@nestjs/jwt";
import { JWT, SETTINGS_TOKEN } from "../../../const/const";
import { JwtPayload } from "jsonwebtoken";
@Injectable()
export class AuthService {
    private readonly optionsAccess: string;
    private readonly secretAccess: string;
    private readonly optionsRefresh: string;
    private readonly secretRefresh: string;
    constructor(private jwtService: JwtService) {
        this.optionsAccess = SETTINGS_TOKEN.TOKEN_ACCESS_LIVE_TIME;
        this.secretAccess = SETTINGS_TOKEN.JWT_ACCESS_SECRET;
        this.optionsRefresh = SETTINGS_TOKEN.TOKEN_REFRESH_LIVE_TIME;
        this.secretRefresh = SETTINGS_TOKEN.JWT_REFRESH_SECRET;
    }

    public generateAccessToken(payload: object): string {
        return this.jwtService.sign(payload, { secret: this.secretAccess, expiresIn: this.optionsAccess });
    }

    public generateRefreshToken(payload: object): string {
        return this.jwtService.sign(payload, { secret: this.secretRefresh, expiresIn: this.optionsRefresh });
    }

    public async getTokens(payload: object): Promise<object> {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, { secret: this.secretAccess, expiresIn: this.optionsAccess }),
            this.jwtService.signAsync(payload, { secret: this.secretRefresh, expiresIn: this.optionsRefresh }),
        ]);

        return { accessToken, refreshToken };
    }

    public getPayloadByAccessToken(token: string): string | JwtPayload | JWT | boolean {
        const { exp } = this.jwtService.decode(token) as JwtPayload;
        if (!exp) return false;
        if (Date.now() >= exp * 1000) {
            return false;
        }

        return this.jwtService.verify(token, SETTINGS_TOKEN.JWT_ACCESS_SECRET);
    }

    public getPayloadByRefreshToken(token: string): string | JwtPayload | JWT | boolean {
        const { exp } = this.jwtService.decode(token) as JwtPayload;
        if (!exp) return false;
        if (Date.now() >= exp * 1000) {
            return false;
        }
        return this.jwtService.verify(token, SETTINGS_TOKEN.JWT_REFRESH_SECRET);
    }

    public async checkTokenByBlackList(token: string): Promise<boolean> {
        const { iat, deviceId } = this.jwtService.decode(token) as JwtPayload;
        const sessionService = new SessionService();
        const session = await sessionService.findSession(deviceId);
        return iat === session?.lastActiveDate;
    }

    public async getPayloadFromToken(refreshToken: string): Promise<JWT> {
        if (!refreshToken) throw new Error();
        const isBlockedToken = await this.checkTokenByBlackList(refreshToken);
        if (isBlockedToken) throw new Error();
        const payload = (await this.getPayloadByRefreshToken(refreshToken)) as JWT;
        if (!payload) throw new Error();

        return payload;
    }
}
