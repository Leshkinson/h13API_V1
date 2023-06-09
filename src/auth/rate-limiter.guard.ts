import { Observable } from "rxjs";
import { Request, Response } from "express";
import { applyDecorators, CanActivate, ExecutionContext, HttpStatus, Injectable, UseGuards } from "@nestjs/common";
import NodeCache from "node-cache";

let count = 1;
const myCache = new NodeCache();

@Injectable()
// export class _RateLimiter implements CanActivate {
//     constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
//     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//     // @ts-ignore
//     async canActivate(context: ExecutionContext): Promise<boolean | Promise<boolean> | Observable<boolean>> {
//         const request: Request = context.switchToHttp().getRequest();
//         const response: Response = context.switchToHttp().getResponse();
//         const url = request.url;
//         const tracker = request.ip;
//         const prefixAgent = request.headers["user-agent"] ? request.headers["user-agent"] : "unKnown";
//         const generateKey = (url: string, agentContext: string, suffix: string): string => {
//             return `${url}-${agentContext}-${suffix}`;
//         };
//         const key = generateKey(url, prefixAgent, tracker);
//         console.log("key", key);
//         await this.cacheManager.get(`${key}`);
//         const some = await this.cacheManager.get(`${key}`);
//         console.log("some", some);
//         if (some) {
//             const foo = this.cacheManager.get(`${key}`);
//             if (Number(foo) > 4) {
//                 response.sendStatus(HttpStatus.TOO_MANY_REQUESTS);
//
//                 return;
//             }
//             count = Number(foo) + 1;
//         }
//         await this.cacheManager.set(`${key}`, count, 10);
//         count = 1;
//
//         return true;
//     }
export class _RateLimiter implements CanActivate {
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
        console.log("key", key);

        if (myCache.has(`${key}`)) {
            const foo = myCache.get(`${key}`);
            if (Number(foo) > 4) {
                response.sendStatus(HttpStatus.TOO_MANY_REQUESTS);

                return;
            }
            count = Number(foo) + 1;
        }
        myCache.set(`${key}`, count, 10);
        count = 1;

        return true;
    }
}

export function RateLimiterGuard() {
    return applyDecorators(UseGuards(_RateLimiter));
}
