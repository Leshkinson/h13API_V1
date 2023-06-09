import { Observable } from "rxjs";
import { Cache } from "cache-manager";
import { Request, Response } from "express";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import {
    applyDecorators,
    CanActivate,
    ExecutionContext,
    HttpStatus,
    Inject,
    Injectable,
    UseGuards,
} from "@nestjs/common";

let count = 1;

@Injectable()
export class _RateLimiter implements CanActivate {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        const response: Response = context.switchToHttp().getResponse();
        const url = request.url;
        const tracker = request.ip;
        const prefixAgent = request.headers["user-agent"] ? request.headers["user-agent"] : "unKnown";
        const generateKey = (url: string, agentContext: string, suffix: string): string => {
            return `${url}-${agentContext}-${suffix}`;
        };
        const key = generateKey(url, prefixAgent, tracker);
        this.cacheManager.get(`${key}`).then(() => console.log("Great"));
        const some = this.cacheManager.get(`${key}`).then(() => console.log("Great2"));
        if (some) {
            const foo = this.cacheManager.get(`${key}`);
            if (Number(foo) > 5) {
                response.sendStatus(HttpStatus.TOO_MANY_REQUESTS);

                return;
            }
            count = Number(foo) + 1;
        }
        this.cacheManager.set(`${key}`, count, 14).then(() => console.log("Great3"));
        count = 1;

        return true;
    }
}

export function RateLimiterGuard() {
    return applyDecorators(UseGuards(_RateLimiter));
}
