import { UserNS, JwtTokens } from "../@types/index.d";

export default class UserDTO {
	email: string;
	username: string;
	isValid: boolean;
	userImage?: string;

	constructor(model: UserNS.IUserDTO) {
		this.email = model.email;
		this.username = model.username;
		this.isValid = model.isValid;
		this.userImage = model.userImage;
	}
}