import * as uuid from "uuid";
import bcrypt from "bcryptjs";
import UserDTO from "../dtos/userDTO.js";
import User from "../models/UserModel.js";
import Tokens from "../models/TokenModel.js";
import TokenService from "./tokenService.js";
import { userNamespace, JwtTokens } from "../@types/index.js";
import APIError from "../exceptions/apiError.js";


class UserService {
	tokenService: TokenService;

	constructor() {
		this.tokenService = new TokenService();
	}

	async registration(email: string, username: string, password: string, passwordConfirm: string): Promise<userNamespace.IUserDTO> {
		if (password !== passwordConfirm)
			throw APIError.BadRequest("Validation Error");
		const hashedPassword = await bcrypt.hash(password, 3);
		const activationLink: string = uuid.v4();
		const user = new User({email, username, password: hashedPassword, activationLink});
		// TODO: send activation email

		const tokens: JwtTokens.TokenPair = this.tokenService.generateTokens({ iss: "server", aud: "client", iat: Date.now() / 1000});
		const tokenModel = new Tokens({userID: user._id, refreshToken: tokens.refreshToken});
		await user.save();
		await tokenModel.save();
		
		const userDTO = new UserDTO({email: user.email, username: user.username, isValid: user.isValid, tokenPair: tokens})
		return userDTO;
	}
}

export default UserService;