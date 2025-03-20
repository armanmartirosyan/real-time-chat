import * as uuid from "uuid";
import bcrypt from "bcryptjs";
import UserDTO from "../dtos/userDTO";
import User, { IUser } from "../models/UserModel";
import MailService from "./mailService";
import TokenService from "./tokenService";
import APIError from "../exceptions/apiError";
import { ITokens } from "../models/TokenModel";
import { userNS, JwtTokens, ApiNS } from "../@types/index";

class UserService {
	tokenService: TokenService;
	mailService: MailService;

	constructor() {
		this.tokenService = new TokenService();
		this.mailService = new MailService();
	}

	async registration(email: string, username: string, password: string, passwordConfirm: string): Promise<userNS.AuthResponseDTO> {
		if (password !== passwordConfirm)
			throw APIError.BadRequest("Validation Error", [{ msg: "Invalid username or password" }]);
		const hashedPassword = await bcrypt.hash(password, 3);
		const activationLink: string = uuid.v4();
		const user = new User({ email, username, password: hashedPassword, activationLink });


		const tokens: JwtTokens.TokenPair = this.tokenService.generateTokens({ iss: "server", aud: "client", iat: Date.now() / 1000, userID: user._id });
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
		const user: IUser | null = await User.findOne({ email });
		if (!user)
			throw APIError.BadRequest("Validation Error", [{ msg: "Invalid username or password" }]);

		const passwordMatch: boolean = await bcrypt.compare(password, user.password);
		if (!passwordMatch)
			throw APIError.BadRequest("Validation Error", [{ msg: "Invalid username or password" }]);

		const tokens: JwtTokens.TokenPair = this.tokenService.generateTokens({ iss: "server", aud: "client", iat: Date.now() / 1000, userID: user._id });
		await this.tokenService.saveToken(user._id, tokens.refreshToken);
		const userDTO = new UserDTO(user);

		return {
			user: userDTO,
			tokenPair: tokens,
		};
	}

	async logout(refreshToken: string): Promise<void> {
		await this.tokenService.removeToken(refreshToken);
		return;
	}

	async activate(activationLink: string): Promise<void> {
		const user: IUser | null = await User.findOne({ activationLink });
		if (!user)
			throw APIError.BadRequest("Link error", [{ msg: "Incorrect activation link" }]);
		user.isValid = true;
		await user.save();
		return;
	}

	async refresh(refreshToken: string): Promise<userNS.AuthResponseDTO> {
		if (!refreshToken)
			throw APIError.UnauthorizedError();

		const userData: JwtTokens.VerifiedJWT = this.tokenService.verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET!);
		const isTokenInDB: ITokens | null = await this.tokenService.findToken(refreshToken);
		if (!userData || !isTokenInDB)
			throw APIError.UnauthorizedError();

		const user: IUser | null = await User.findOne({ _id: userData.userID });
		if (!user)
			throw APIError.UnauthorizedError();

		const tokens: JwtTokens.TokenPair = this.tokenService.generateTokens({ iss: "server", aud: "client", iat: Date.now() / 1000, userID: user._id });
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

		const user: IUser | null = await User.findOne({ username });
		if (!user)
			throw APIError.BadRequest("No such user");
		return new UserDTO(user);
	}

	async uploadAvatar(avatar: string, userID: string): Promise<boolean> {
		const user: IUser | null = await User.findOne({ _id: userID });
		if (!user) {
			throw APIError.UnauthorizedError();
		}
		user.userImage = avatar;
		await user.save();
		return true;
	}

	async updateUser(userFormData: userNS.UserFormData, userID: string): Promise<ApiNS.ApiResponse> {
		const { username, email, currentPassword, newPassword, confirmPassword } = userFormData;
		const isUsernameExist: IUser | null = await User.findOne({ username });
		if (isUsernameExist && isUsernameExist._id.toString() !== userID)
			throw APIError.BadRequest("Username is already taken", [{ field: "username" }]);

		const isEmailExist: IUser | null = await User.findOne({ email });
		if (isEmailExist && isEmailExist._id.toString() !== userID)
			throw APIError.BadRequest("Email is already taken", [{ field: "email" }]);

		const user: IUser | null = await User.findOne({ _id: userID });
		if (!user)
			throw APIError.UnauthorizedError();

		if (currentPassword && newPassword && confirmPassword) {
			const passwordMatch: boolean = await bcrypt.compare(currentPassword, user.password);
			if (!passwordMatch)
				throw APIError.BadRequest("Passwords do not match", [{ field: "currentPassword" }]);
			if (newPassword !== confirmPassword)
				throw APIError.BadRequest("Invalid password", [{ field: "newPassword" }]);

			user.password = await bcrypt.hash(newPassword, 3);
		}
		user.username = username;
		if (email && user.email !== email) {
			user.email = email;
			user.isValid = false;
			user.activationLink = uuid.v4();
			await this.mailService.sendActivationMail(email, `${process.env.API_URL}/api/user/activate/${user.activationLink}`);
		}
		await user.save();
		return { success: true };
	}
}

export default UserService;