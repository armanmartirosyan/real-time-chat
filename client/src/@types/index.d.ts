export interface IUserDTO {
  _id: string,
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

export interface IUserCredentials {
	email: string,
	password: string,
	username?: string,
	passwordConfirm?: string,
}

export type ApiError = {
	field: string,
	message: string,
}

export interface ApiResponse {
	success: boolean,
  data?: any,
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

export interface IChat {
	_id: string;
	name: string;
	members: {
		_id: string;
		username: string;
		userImage?: string;
	}[];
}

export interface IMessage {
	_id: string;
	userId: string;
  content: string;
	createdAt: string;
}