import { Request, Response, NextFunction } from "express";
import User from "../models/UserModel.js";
import UserService from "../services/userService.js";
import { UserCredentials } from "../@types/index.d.js";

class UserController {
	userService: UserService;

	constructor() {
		this.userService = new UserService();
	}

	async registration(req: Request, res: Response, next: NextFunction): Promise<any> {
			const {email, username, password, passwordConfirm }: UserCredentials = req.body;
			
			try {
				const user = new User({ email, username, password, activationLink: "somelink" });
				// TODO: call user service to save the user
				await user.save();
				res.status(201).json(user);
			} catch (error: any) {
				console.log(error.errorResponse);
				if (error.errorResponse?.code === 11000) {
					res.status(400).json({ message: `User already exist`, error: error.errorResponse.keyValue })
				}
			}
	}
}

export default UserController;