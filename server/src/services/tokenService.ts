import jwt, {JwtPayload} from "jsonwebtoken";
import { JwtTokens } from "../@types/index.d";
import Tokens from "../models/TokenModel";
import mongoose from "mongoose";

class TokenService {
	generateTokens(payload: JwtPayload): JwtTokens.TokenPair {
		const accessToken: string = jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {expiresIn: "30m"});
		const refreshToken: string = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {expiresIn: "1d"});
		
		return {accessToken, refreshToken};
	}

	async saveToken(userID: mongoose.Schema.Types.ObjectId, refreshToken: string): Promise<void> {
		await Tokens.findOneAndUpdate(
			{ userID },
			{ refreshToken },
			{ upsert: true, new: true }
		);
		return ;
	}
}

export default TokenService;
