import { IncomingMessage } from "http";
import jwt from "jsonwebtoken";

export interface IVerifyClient {
  origin: string;
  secure: boolean;
  req: IncomingMessage;
}

export type VerifyClientDone = (
  result: boolean,
  code?: number,
  name?: string,
) => void;

export type ClientMessage = {
  _id: string;
  chatId: string;
  userId: string;
  content: string;
};

export type VerifiedJWT = JwtTokens.JwtPayload | null;


interface JwtPayload extends jwt.JwtPayload {
  iss: string;
  aud: string;
  iat: number;
  userID: string;
}

declare module 'http' {
  interface IncomingMessage {
    _wsUserData?: JwtPayload;
  }
}