import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
//import { ExtractJwt, Strategy } from "passport-jwt";
import { Strategy } from "passport-local";
import { JWT, SETTINGS_TOKEN } from "../../const/const";

// type JwtPayload = {
//     sub: string;
//     username: string;
// };

@Injectable()
export class AccessStrategy extends PassportStrategy(Strategy, "access") {
    constructor() {
        super();
        //{
        //     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        //     ignoreExpiration: false,
        //     secretOrKey: SETTINGS_TOKEN.JWT_ACCESS_SECRET,
        // }
    }

    // validate(payload: JWT) {
    //     console.log("here");
    //     console.log("payload", payload);
    //     return payload;
    // }
    async validate(username: string, password: string): Promise<any> {
        console.log("username", username);
        console.log("password", password);
        //const user = await this.authService.validateUser(username, password);
        // if (!user) {
        //     throw new UnauthorizedException();
        // }
        // return user;
    }
}
