import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JWT, SETTINGS_TOKEN } from "../../const/const";

@Injectable()
export class AccessStrategy extends PassportStrategy(Strategy, "access") {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: SETTINGS_TOKEN.JWT_ACCESS_SECRET,
        });
    }

    async validate(payload: JWT) {
        return { userId: payload.id }
    }
}
