import mongoose from "mongoose";
import Tokens, {ITokens } from "../models/TokenModel";
import jwt, {JwtPayload} from "jsonwebtoken";
import { JwtTokens } from "../@types/index.d";
import APIError from "../exceptions/apiError";

class TokenService {
	generateTokens(payload: JwtPayload): JwtTokens.TokenPair {
		const accessToken: string = jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {expiresIn: "30m"});
		const refreshToken: string = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {expiresIn: "1d"});
		
		return {accessToken, refreshToken};
	}

	async saveToken(userID: mongoose.Schema.Types.ObjectId, refreshToken: string): Promise<void> {
		const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

		await Tokens.findOneAndUpdate(
			{ userID },
			{ refreshToken, expiresAt},
			{ upsert: true, new: true }
		);
		return ;
	}

	async findToken(refreshToken: string): Promise<ITokens | null> {
		const token: ITokens | null = await Tokens.findOne({ refreshToken });
		return token;
	}

	async removeToken(refreshToken: string): Promise<void> {
		const token: ITokens | null = await Tokens.findOne({ refreshToken });
		if (!token)
			throw APIError.NoContent("No Content");
		await token.deleteOne();
		return ;
	}

	verifyToken(token: string, secret: string): JwtTokens.VerifiedJWT {
		try {
			const userData: JwtTokens.VerifiedJWT = jwt.verify(token, secret);
			return userData;
		} catch(error: any) {
			throw APIError.UnauthorizedError();
		}
	}
}

export default TokenService;
