import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { SETTINGS_TOKEN } from "../../const/const";
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "custom-jwt") {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: SETTINGS_TOKEN.JWT_ACCESS_SECRET,
        });
    }

    async validate(payload: any) {
        return { userId: payload.id }
    }
}
