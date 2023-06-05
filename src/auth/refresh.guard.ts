import {Inject, Injectable} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import {UsersRepository} from "../users/users.repository";
import {UserModel} from "../users/schema/user.schema";

@Injectable()
export class RefreshGuard extends AuthGuard("refresh") {
    // constructor(@Inject("userRepository") private readonly userRepository: UsersRepository) {
    //     super();
    //     this.userRepository = new UsersRepository(UserModel);
    // }
    //
    // async validate(value: string) {
    //     try {
    //         const user = await this.userRepository.findUserByParam(value);
    //         if (user) {
    //             throw new Error();
    //         }
    //     } catch (error) {
    //         if (error instanceof Error) {
    //             return false;
    //         }
    //     }
    //     return true;
    // }
}