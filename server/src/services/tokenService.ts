import fs from "node:fs";
import path from "node:path";
import mongoose from "mongoose";
import Tokens, {ITokens } from "../models/TokenModel";
import jwt, {JwtPayload} from "jsonwebtoken";
import { JwtTokens } from "../@types/index.d";
import APIError from "../exceptions/apiError";

class TokenService {
  private privateKey: string;
  private publicKey: string;

  constructor() {
    this.privateKey = fs.readFileSync(path.join(__dirname, "../certificates/private.pem"), 'utf-8');
    this.publicKey = fs.readFileSync(path.join(__dirname, "../certificates/public.pem"), 'utf-8');
  }

	generateTokens(payload: JwtPayload): JwtTokens.TokenPair {
    const accessToken: string = jwt.sign(payload, this.privateKey, { algorithm: 'RS256', expiresIn: '1h' });
    const refreshToken: string = jwt.sign(payload, this.privateKey, { algorithm: 'RS256', expiresIn: '1d' });
		
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

	verifyToken(token: string): JwtTokens.VerifiedJWT {
		try {
			const userData: JwtPayload | string = jwt.verify(token, this.publicKey, { algorithms: ['RS256'] });
			if (typeof userData === "string")
				throw APIError.UnauthorizedError();
			return userData as JwtTokens.VerifiedJWT;
		} catch(error: any) {
			throw APIError.UnauthorizedError();
		}
	}
}

export default TokenService;
