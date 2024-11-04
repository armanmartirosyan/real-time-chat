import * as uuid from "uuid";
import bcrypt from "bcryptjs";
import UserDTO from "../dtos/userDTO";
import User from "../models/UserModel";
import MailService from "./mailService";
import TokenService from "./tokenService";
import APIError from "../exceptions/apiError";
import { ITokens } from "../models/TokenModel";
import { userNS, JwtTokens } from "../@types/index";

class UserService {
	tokenService: TokenService;
	mailService: MailService;

	constructor() {
		this.tokenService = new TokenService();
		this.mailService = new MailService();
	}

	async registration(email: string, username: string, password: string, passwordConfirm: string): Promise<userNS.AuthResponseDTO> {
		if (password !== passwordConfirm)
			throw APIError.BadRequest("Validation Error", [{msg: "Invalid username or password"}]);
		const hashedPassword = await bcrypt.hash(password, 3);
		const activationLink: string = uuid.v4();
		const user = new User({email, username, password: hashedPassword, activationLink});
		
		
		const tokens: JwtTokens.TokenPair = this.tokenService.generateTokens({ iss: "server", aud: "client", iat: Date.now() / 1000, userID: user._id});
		await this.tokenService.saveToken(user._id, tokens.refreshToken);
		await user.save();
		
		await this.mailService.sendActivationMail(email, `${process.env.API_URL}/api/user/activate/${activationLink}`);

		const userDTO = new UserDTO(user);
		return {
			user: userDTO,
			tokenPair: tokens,
		};
	}

	async login(email: string, password: string): Promise<userNS.AuthResponseDTO> {
		const user = await User.findOne({ email });
		if (!user)
			throw APIError.BadRequest("Validation Error", [{ msg: "Invalid username or password" }]);

		const passwordMatch: boolean = await bcrypt.compare(password, user.password);
		if (!passwordMatch)
			throw APIError.BadRequest("Validation Error", [{ msg: "Invalid username or password" }]);

		const tokens: JwtTokens.TokenPair = this.tokenService.generateTokens({ iss: "server", aud: "client", iat: Date.now() / 1000, userID: user._id});
		await this.tokenService.saveToken(user._id, tokens.refreshToken);
		const userDTO = new UserDTO(user);
		
		return {
			user: userDTO,
			tokenPair: tokens,
		};
	}

	async logout(refreshToken: string): Promise<void> {
		await this.tokenService.removeToken(refreshToken);
		return ;
	}

	async activate(activationLink: string): Promise<void> {
		const user = await User.findOne({ activationLink });
		if (!user)
			throw APIError.BadRequest("Link error", [{ msg: "Incorrect activation link" }]);
		user.isValid = true;
		await user.save();
		return ;
	}

	async refresh(refreshToken: string): Promise<userNS.AuthResponseDTO> {
		if (!refreshToken)
			throw APIError.UnauthorizedError();

		const userData: JwtTokens.VerifiedJWT = this.tokenService.verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET!);
		const isTokenInDB: ITokens | null = await this.tokenService.findToken(refreshToken);
		if (!userData || !isTokenInDB)
			throw APIError.UnauthorizedError();
		
		const user = await User.findOne({ _id: userData.userID });
		if (!user)
			throw APIError.UnauthorizedError();

		const tokens: JwtTokens.TokenPair = this.tokenService.generateTokens({ iss: "server", aud: "client", iat: Date.now() / 1000, userID: user._id});
		await this.tokenService.saveToken(user._id, tokens.refreshToken);
		const userDTO = new UserDTO(user);
		
		return {
			user: userDTO,
			tokenPair: tokens,
		};
	}

	async getUser(username: string): Promise<userNS.IUserDTO> {
		if (!username)
			throw APIError.BadRequest("No such user");

		const user = await User.findOne({ username });
		if (!user)
			throw APIError.BadRequest("No such user");
		return new UserDTO(user);
	}
}

export default UserService;