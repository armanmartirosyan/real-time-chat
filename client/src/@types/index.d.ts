declare module '*.module.css' {
    const classes: { [key: string]: string };
    export default classes;
}
export interface IUserDTO {
    email: string,
    username: string,
    isValid: boolean,
}

export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}

export interface AuthResponseDTO {
    user: IUserDTO,
    tokenPair: TokenPair,
}