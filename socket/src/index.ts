import dotenv from "dotenv";
dotenv.config();
import { IncomingMessage } from "http";
import { WebSocketServer, WebSocket } from "ws";

const WS_PORT: number = Number(process.env.WS_PORT) || 8081;
const wss = new WebSocketServer({ port: WS_PORT, noServer: true });

type ClientMessage = {
  _id: string;
  chatId: string;
  userId: string;
  content: string;
};


wss.on("connection", async (ws: WebSocket, req: IncomingMessage ): Promise<void> => {
  console.log("New connection", ws, req);
});
