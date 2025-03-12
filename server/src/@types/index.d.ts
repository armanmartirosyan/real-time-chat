
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
		userImage?: string,
	}

	interface AuthResponseDTO {
		user: IUserDTO,
		tokenPair: JwtTokens.TokenPair,
	}

	interface UserImageBody {
		avatar: string,
	}
}

export namespace JwtTokens {
	export interface TokenPair {
		accessToken: string;
		refreshToken: string;
	}
	
	export type VerifiedJWT = string | jwt.JwtPayload | null;
}