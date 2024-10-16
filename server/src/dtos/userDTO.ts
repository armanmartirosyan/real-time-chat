import { userNamespace, JwtTokens } from "../@types/index.d.js";

export default class UserDTO {
	email: string;
	username: string;
	isValid: boolean;
	tokenPair: JwtTokens.TokenPair;

	constructor(model: userNamespace.IUserDTO) {
		this.email = model.email;
		this.username = model.username;
		this.isValid = model.isValid;
		this.tokenPair = model.tokenPair;
	}
}