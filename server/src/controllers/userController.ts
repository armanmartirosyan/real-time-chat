import { userNS, ApiNS } from "../@types/index.d";
import APIError from "../exceptions/apiError";
import UserService from "../services/userService";
import { Request, Response, NextFunction } from "express";

class UserController {
	userService: UserService;

	constructor() {
		this.userService = new UserService();
	}

	async registration(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { email, username, password, passwordConfirm }: userNS.RegistrationCredentials = req.body;
			const userData: userNS.AuthResponseDTO = await this.userService.registration(email, username, password, passwordConfirm);
			res.cookie("refreshToken", userData.tokenPair.refreshToken, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
			res.status(200).json(userData);
			return;
		} catch (error: any) {
			next(error);
		}
	}

	async login(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { email, password }: userNS.LoginCredentials = req.body;
			const userData: userNS.AuthResponseDTO = await this.userService.login(email, password);
			res.cookie("refreshToken", userData.tokenPair.refreshToken, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
			res.status(200).json(userData);
			return;
		} catch (error: any) {
			next(error);
		}
	}

	async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { refreshToken }: Record<string, string> = req.cookies;
			await this.userService.logout(refreshToken);
			res.clearCookie("refreshToken");
			res.status(200).json({ msg: "Success" });
			return;
		} catch (error: any) {
			next(error);
		}
	}

	async activate(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const activationLink: string = req.params.link;
			await this.userService.activate(activationLink);
			res.redirect(process.env.CLIENT_URL!);
			return;
		} catch (error: any) {
			next(error);
		}
	}

	async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { refreshToken }: Record<string, string> = req.cookies;
			const userData: userNS.AuthResponseDTO = await this.userService.refresh(refreshToken);
			res.cookie("refreshToken", userData.tokenPair.refreshToken, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
			res.status(200).json(userData);
			return;
		} catch (error: any) {
			next(error);
		}
	}

	async getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const username: string = req.params.username;
			const userDTO: userNS.IUserDTO = await this.userService.getUser(username);
			res.status(200).json(userDTO);
			return;
		} catch (error: any) {
			next(error);
		}
	}

	async uploadAvatar(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { avatar }: userNS.UserImageBody = req.body;
			const userID: string = req.user.userID;
			const success: boolean = await this.userService.uploadAvatar(avatar, userID);
			res.status(200).json({ success });
			return;
		} catch (error: any) {
			next(error);
		}
	}

	async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const userFormData: userNS.UserFormData = req.body;
			const userID: string = req.user.userID;
			const response: ApiNS.ApiResponse = await this.userService.updateUser(userFormData, userID);	
			res.status(200).json(response);
			return ;
		} catch (error: any) {
			next(error);
		}
	}
}

export default UserController;