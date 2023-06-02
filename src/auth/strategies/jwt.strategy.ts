import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { SETTINGS_TOKEN } from "../../const/const";
import { Request } from "express";
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "custom-jwt") {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: SETTINGS_TOKEN.JWT_ACCESS_SECRET,
        });
    }

    // async validate(payload: any) {
    //     console.log("payload", payload);
    //     return { userId: payload.sub, username: payload.username };
    // }

    // validate(payload: any) {
    //     console.log("req", payload);
    // console.log("payload", payload);
    // const refreshToken = req.get("Authorization").replace("Bearer", "").trim();
    // return { ...payload, refreshToken };
    // }

    // async validate(req: Request, payload: any) {
    //     console.log("req", req);
    //     console.log("payload", payload);
    //     const refreshToken = req.get("Authorization").replace("Bearer", "").trim();
    //     return { ...payload, refreshToken };
    // }

    async validate(payload: any) {
        console.log("payload", payload);
        console.log({ userId: payload.sub, username: payload.username });
    }
}
