
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
		tokenPair: JwtTokens.TokenPair,
	}
}

export namespace JwtTokens {
	export interface TokenPair {
		accessToken: string;
		refreshToken: string;
	}
}