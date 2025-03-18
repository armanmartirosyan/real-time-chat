import express from "express";

export declare namespace userNS {
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

	interface UserFormData {
		username: string,
		email: string,
		currentPassword: string,
		newPassword: string,
		confirmPassword: string,
	}
}

export declare namespace JwtTokens {
	export interface TokenPair {
		accessToken: string;
		refreshToken: string;
	}

	export type VerifiedJWT = string | jwt.JwtPayload | null;
}

export declare namespace ApiNS {
	export type ApiError = {
		field: "username" | "email" | "currentPassword" | "newPassword" | "general",
		message: string,
	}

	export interface ApiResponse {
		success: boolean,
		errors?: ApiError[],
	}

}

export declare module "express" {
	export interface Request {
		user?: JwtTokens.VerifiedJWT;
	}
}