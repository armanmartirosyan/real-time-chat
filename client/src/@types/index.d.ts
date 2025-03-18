export interface IUserDTO {
	email: string,
	username: string,
	userImage: string,
	isValid: boolean,
}

export interface IUserFormData {
	username: string,
	email: string,
	currentPassword: string,
	newPassword: string,
	confirmPassword: string,
}

export type ApiError = {
	field: "username" | "email" | "currentPassword" | "newPassword" | "general",
	message: string,
}

export interface ApiResponse {
	success: boolean,
	errors?: ApiError[],
	message?: string,
}

export interface TokenPair {
	accessToken: string;
	refreshToken: string;
}

export interface AuthResponseDTO {
	user: IUserDTO,
	tokenPair: TokenPair,
}
