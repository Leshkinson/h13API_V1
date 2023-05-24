export interface IAuth {
    readonly loginOrEmail: string;
    readonly password: string;
}

export interface IRegistration {
    readonly login: string;
    readonly password: string;
    readonly email: string;
}
