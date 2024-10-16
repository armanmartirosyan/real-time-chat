import { Request, Response, NextFunction } from "express";
import User from "../models/UserModel.js";
import UserService from "../services/userService.js";
import { userNamespace } from "../@types/index.d.js";
import mongoose from "mongoose";

class UserController {
	userService: UserService;

	constructor() {
		this.userService = new UserService();
	}

	async registration(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const {email, username, password, passwordConfirm }: userNamespace.UserCredentials = req.body;
			const userData: userNamespace.IUserDTO = await this.userService.registration(email, username, password, passwordConfirm);
			res.cookie("refreshToken", userData.tokenPair.refreshToken, {maxAge: 60 * 60 * 1000, httpOnly: true});
			res.json(userData);
			return ;
		} catch (error: any) {
			next(error);
		}
	}
}

export default UserController;