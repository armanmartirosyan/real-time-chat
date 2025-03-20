import { ApiNS } from "../@types/index.d";
import { Request, Response, NextFunction } from "express";

export default function (req: Request, res: Response, next: NextFunction): void {
	const { email, password, username, confirmPassword }: Record<string, string> = req.body;
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	let errors: ApiNS.ApiError[] = [];

	if (!email || email.length < 8 || email.length > 64)
		errors.push({ field: "email", message: "Email must be between 8 and 64 characters" });
	if (!emailRegex.test(email))
		errors.push({ field: "email", message: "Please enter a valid email address" });
	if (!password || password.length < 8 || password.length > 64)
		errors.push({ field: "password", message: "Password must be between 8 and 64 characters" });

	const isRegistration: boolean = username !== undefined && confirmPassword !== undefined;
	if (isRegistration) {
		if (!username || username.length < 8 || username.length > 64)
			errors.push({ field: "username", message: "Username must be between 8 and 64 characters" });

		if (confirmPassword !== password)
			errors.push({ field: "confirmPassword", message: "Passwords do not match" });
	}

	if (errors.length > 0) {
		res.status(400).json({ success: false, errors });
		return;
	}
	next();
}