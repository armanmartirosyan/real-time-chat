
export namespace userNS {
	interface RegistrationCredentials {
		email: string,
		username: string,
		password: string,
		passwordConfirm: string,
	}

	interface LoginCredentials {
		email: string,
		password: string,
	}

	interface IUserDTO {
		email: string,
		username: string,
		isValid: boolean,
	}

	interface AuthResponseDTO {
		user: IUserDTO,
		tokenPair: JwtTokens.TokenPair,
	}
}

export namespace JwtTokens {
	export interface TokenPair {
		accessToken: string;
		refreshToken: string;
	}
	
	export type VerifiedJWT = string | jwt.JwtPayload | null;
}