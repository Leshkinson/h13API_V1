import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JWT, SETTINGS_TOKEN } from "../../const/const";

// type JwtPayload = {
//     sub: string;
//     username: string;
// };

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: SETTINGS_TOKEN.JWT_ACCESS_SECRET,
        });
    }

    validate(payload: JWT) {
        return payload;
    }
}
