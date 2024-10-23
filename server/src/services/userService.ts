import * as uuid from "uuid";
import bcrypt from "bcryptjs";
import UserDTO from "../dtos/userDTO";
import User from "../models/UserModel";
import Tokens from "../models/TokenModel";
import TokenService from "./tokenService";
import { userNamespace, JwtTokens } from "../@types/index";
import APIError from "../exceptions/apiError";
import MailService from "./mailService";

class UserService {
	tokenService: TokenService;
	mailService: MailService;

	constructor() {
		this.tokenService = new TokenService();
		this.mailService = new MailService();
	}

	async registration(email: string, username: string, password: string, passwordConfirm: string): Promise<userNamespace.IUserDTO> {
		if (password !== passwordConfirm)
			throw APIError.BadRequest("Validation Error");
		const hashedPassword = await bcrypt.hash(password, 3);
		const activationLink: string = uuid.v4();
		const user = new User({email, username, password: hashedPassword, activationLink});
		
		await this.mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);

		const tokens: JwtTokens.TokenPair = this.tokenService.generateTokens({ iss: "server", aud: "client", iat: Date.now() / 1000});
		const tokenModel = new Tokens({userID: user._id, refreshToken: tokens.refreshToken});
		await user.save();
		await tokenModel.save();
		
		const userDTO = new UserDTO({email: user.email, username: user.username, isValid: user.isValid, tokenPair: tokens})
		return userDTO;
	}
}

export default UserService;