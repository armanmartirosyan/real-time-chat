import { IncomingMessage } from "node:http";
import { WebSocket } from "ws";
import jwt from "jsonwebtoken";
import { EventEmitter } from "node:stream";

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
  userId: string;
  chatId: string;
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
    _wsUserToken: string;
  }
}

declare module "ws" {
  interface  WebSocket {
    isAlive?: boolean;
  }
}