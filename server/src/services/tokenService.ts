import jwt, {JwtPayload} from "jsonwebtoken";
import { JwtTokens } from "../@types/index.d";

class TokenService {
	generateTokens(payload: JwtPayload): JwtTokens.TokenPair {
		const accessToken: string = jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {expiresIn: "30m"});
		const refreshToken: string = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {expiresIn: "1d"});
		
		return {accessToken, refreshToken};
	}
}

export default TokenService;
