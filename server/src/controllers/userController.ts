import { userNS } from "../@types/index.d";
import APIError from "../exceptions/apiError";
import UserService from "../services/userService";
import { Request, Response, NextFunction } from "express";
import { Result, ValidationError, validationResult } from "express-validator";

class UserController {
	userService: UserService;

	constructor() {
		this.userService = new UserService();
	}

	async registration(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const errors: Result<ValidationError> = validationResult(req);
			if (!errors.isEmpty())
				throw APIError.BadRequest("Validaiton Error", errors.array());
			const {email, username, password, passwordConfirm }: userNS.RegistrationCredentials = req.body;
			const userData: userNS.IUserDTO = await this.userService.registration(email, username, password, passwordConfirm);
			res.cookie("refreshToken", userData.tokenPair.refreshToken, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
			res.json(userData);
			return ;
		} catch (error: any) {
			next(error);
		}
	}

	async login(req: Request, res: Response, next: NextFunction): Promise<void> {
		try{
			const errors: Result<ValidationError> = validationResult(req);
			if (!errors.isEmpty())
				throw APIError.BadRequest("validation Error", errors.array());
			const { email, password }: userNS.LoginCredentials = req.body;
			const userData: userNS.IUserDTO = await this.userService.login(email, password);
			res.cookie("refreshToken", userData.tokenPair.refreshToken, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
			res.json(userData);
			return ;
		} catch(error: any) {
			next(error);
		}
	}

	async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
		try{
			const { refreshToken }: Record<string, string> = req.cookies;
			await this.userService.logout(refreshToken);
			res.clearCookie("refreshToken");
			res.status(200).json({msg: "Success"});
			return ;
		} catch(error: any) {
			next(error);
		}
	}

	async activate(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const activationLink: string = req.params.link;
			await this.userService.activate(activationLink);
			res.redirect(process.env.CLIENT_URL!);
			return ;
		} catch(error: any) {
			next(error);
		}
	}
}

export default UserController;