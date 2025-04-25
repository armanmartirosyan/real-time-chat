import express from "express";
import jwt from "jsonwebtoken";

export declare namespace UserNS {
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
		success: boolean,
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
	interface JwtPayload extends jwt.JwtPayload{
		iss: string;
		aud: string;
		iat: number;
		userID: string;
	}

	interface TokenPair {
		accessToken: string;
		refreshToken: string;
	}

	type VerifiedJWT = JwtTokens.JwtPayload | null;
}

export declare namespace ApiNS {
	type ApiError = {
		field: string,
		message: string,
	}

	interface ApiResponse {
		success: boolean,
		data?: any,
		errors?: ApiError[],
	}

}

export declare namespace ChatNS {
	interface createChat {
		firstId: string;
		secondId: string;
	}

}

export declare module "express" {
	export interface Request {
		user?: JwtTokens.VerifiedJWT;
	}
}