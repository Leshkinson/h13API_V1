import { IAuth, IRegistration } from "../interface/auth.interface";

export class AuthDto implements IAuth {
    readonly loginOrEmail: string;
    readonly password: string;

    constructor(props: IAuth) {
        this.loginOrEmail = props.loginOrEmail;
        this.password = props.password;
    }
}

export class RegistrationDto implements IRegistration {
    readonly login: string;
    readonly password: string;
    readonly email: string;

    constructor(props: IRegistration) {
        this.login = props.login;
        this.password = props.password;
        this.email = props.email;
    }
}
