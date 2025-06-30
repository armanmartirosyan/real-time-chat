import jwt from "jsonwebtoken";
import fs from "node:fs";
import path from "node:path";
import ServiceError from "../exceptions/serviceError";
import { JwtPayload, VerifiedJWT } from "../types";

class TokenService {
  private publicKey: string;

  constructor() {
    try {
      this.publicKey = fs.readFileSync(path.join(__dirname, "../../certificates/public.pem"), "utf-8");
      console.log("Public key loaded successfully.");
    } catch (error: any) {
      console.error('\n--- CRITICAL ERROR: Failed to load cryptographic certificates ---');
      console.error(`An unexpected error occurred while loading certificates: ${error.message}`);
      console.error('Details:', error);
      console.error('------------------------------------------------------------------\n');

      process.exit(1);
    }
  }

  verifyToken(token: string): Promise<VerifiedJWT> {
    try {
      const userData: jwt.JwtPayload | string =  jwt.verify(token, this.publicKey, { algorithms: ['RS256']})

      if (typeof userData === "string")
        throw ServiceError.UnauthorizedError();
      return userData as VerifiedJWT;
    } catch (error: any) {
      throw ServiceError.UnauthorizedError();
    }
  }
}

export default TokenService;