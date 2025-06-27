import { WS_PORT, WS_HOST, ALLOWED_ORIGINS, REST_API_URL } from "./envConfig";
import http, { IncomingMessage, Server } from "http";
import { WebSocketServer, WebSocket, RawData } from "ws";
import { IVerifyClient, VerifiedJWT, VerifyClientDone, ClientMessage } from "./types";
import TokenService from "./services/tokenService";
import ServiceError from "./exceptions/serviceError";


class App {
  readonly HEARTBEAT_VALUE = 1;
  readonly HEARBEAT_RATE = 30000;
  readonly PORT = WS_PORT;
  readonly HOST = WS_HOST;
  readonly REST_API_URL = REST_API_URL;

  private httpServer: Server;
  private wss: WebSocketServer;
  private tokenService: TokenService;
  private userSocketMap: Map<string, WebSocket>;
  private chatUserMap: Map<string, Set<string>>;

  constructor() {
    this.httpServer = http.createServer();
    this.wss = new WebSocketServer({
      server: this.httpServer,
      verifyClient: this.verifyClient.bind(this),
    });
    this.tokenService = new TokenService();
    this.userSocketMap = new Map<string, WebSocket>();
    this.chatUserMap = new Map<string, Set<string>>();
  }

  private verifyClient(info: IVerifyClient, done: VerifyClientDone): void {
    const origin: string = info.origin;

    if (!ALLOWED_ORIGINS.includes(origin)) {
      console.error(`Connection rejected from origin: ${origin}`);
      return done(false, 403, "Forbidden");
    }

    try {
      const url = new URL(info.req.url || "", `http://${info.req.headers.host}`);
      const token: string | null = url.searchParams.get("token");
      if (!token) {
        console.error("Missing token in WebSocket URL");
        return done(false, 401, "Unauthorised");
      }
      const userData: VerifiedJWT = this.tokenService.verifyToken(token);
      if (typeof userData === "string")
        return done(false, 401, "Unauthorised");
      info.req._wsUserData = userData;
      info.req._wsUserToken = token;
      return done(true);
    } catch (error: any) {
      console.error("Token verification failed");
      console.error(error);
      if (error instanceof ServiceError)
        return done(false, error.status, error.message);
      return done(false, 403, "Forbidden");
    }
  }

  private listen(): void {
    this.httpServer.listen(this.PORT, this.HOST, () => {
      console.log(`Server is running on port ${this.PORT}`);
    });
  }

  private async saveMessage(message: ClientMessage, token: string): Promise<void> {
    try {
      const res: Response = await fetch(`${REST_API_URL}/api/msg/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(message),
      });

      console.log(message);
      if (!res.ok) {
        console.error(`Failed to save message: ${res.statusText}`);
      }
    } catch (err) {
      console.error("Error sending message to REST API:", err);
    }
  }

  private onConnection(): void {
    this.wss.on("connection", async (ws: WebSocket, req: IncomingMessage): Promise<void> => {
      ws.isAlive = true;
      this.userSocketMap.set(req._wsUserData!.userID, ws);

      ws.on("message", async (rawMessage: RawData) => {
        try {
          const message: ClientMessage = JSON.parse(rawMessage.toString());
          const userId = req._wsUserData!.userID;

          switch (message.type) {
            case "join_chat": {
              const { chatId } = message;

              if (!this.chatUserMap.has(chatId)) {
                this.chatUserMap.set(chatId, new Set());
              }

              this.chatUserMap.get(chatId)!.add(userId);
              console.log(`User ${userId} joined chat ${chatId}`);
              break;
            }

            case "leave_chat": {
              const { chatId } = message;
              const chatUsers = this.chatUserMap.get(chatId);

              if (chatUsers) {
                chatUsers.delete(userId);
                console.log(`User ${userId} left chat ${chatId}`);

                if (chatUsers.size === 0) {
                  this.chatUserMap.delete(chatId);
                }
              }
              break;
            }

            case "message": {
              const { chatId, content } = message;
              const userIdsInChat = this.chatUserMap.get(chatId);

              if (!userIdsInChat) {
                console.warn(`No users in chat ${chatId} to send message`);
                return;
              }

              const payload = JSON.stringify({
                type: "message",
                from: userId,
                chatId,
                content,
              });

              for (const uid of userIdsInChat) {
                const recipient = this.userSocketMap.get(uid);
                if (recipient && recipient.readyState === WebSocket.OPEN) {
                  recipient.send(payload);
                }
              }

              await this.saveMessage(message, req._wsUserToken);
              break;
            }

            default:
              console.warn(`Unknown message type: ${(message as any).type}`);
          }

        } catch (error: any) {
          console.error("WS: Invalid message", error);
        }
      });



      ws.on("close", () => {
        this.userSocketMap.delete(req._wsUserData!.userID);
        console.log(`WS: user ${req._wsUserData!.userID} disconnected`);
      });

      ws.on("pong", () => {
        ws.isAlive = true;
      });
    });
  }

  startHeartBeat(): void {
    setInterval(() => {
      this.wss.clients.forEach((client) => {
        const isAlive = Reflect.get(client, "isAlive");
        if (typeof (isAlive) !== `boolean`)
          throw new TypeError("Field is Alive does not exist in type WebSocket");

        if (!isAlive) {
          client.terminate();
          return;
        }

        Reflect.set(client, "isAlive", false);
        client.ping();
      });
    }, this.HEARBEAT_RATE);
  }

  public startup(): void {
    this.onConnection();
    this.startHeartBeat();
    this.listen();
  }
}

export default App;