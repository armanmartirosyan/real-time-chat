import { JwtTokens } from "../@types/index.d";
import APIError from "../exceptions/apiError";
import TokenService from "../services/tokenService";
import express, { Request, Response, NextFunction } from "express";


export default function (req: Request, res: Response, next: NextFunction) {
	try {
		const authorizationHeader: string | undefined = req.headers.authorization;
		if (!authorizationHeader)
			return next(APIError.UnauthorizedError());

		const accessToken: string = authorizationHeader.split(" ")[1];
		if (!accessToken)
			return next(APIError.UnauthorizedError());
		
		const tokenService = new TokenService();
		const userData: JwtTokens.VerifiedJWT = tokenService.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET!);
		if (!userData)
			return next(APIError.UnauthorizedError());
		next();
	} catch (error: any) {
		return next(APIError.UnauthorizedError());
	}
}