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