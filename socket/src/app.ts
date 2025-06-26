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

  constructor() {
    this.httpServer = http.createServer();
    this.wss = new WebSocketServer({
      server: this.httpServer,
      verifyClient: this.verifyClient.bind(this),
    });
    this.tokenService = new TokenService();
    this.userSocketMap = new Map<string, WebSocket>();
  }

  private verifyClient(info: IVerifyClient, done: VerifyClientDone): void {
    const origin: string = info.origin;

    if (!ALLOWED_ORIGINS.includes(origin)) {
      console.error(`Connection rejected from origin: ${origin}`);
      return done(false, 403, "Forbidden");
    }

    const authHeader: string | undefined = info.req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
      return done(false, 401, "Unauthorised");

    const token: string = authHeader.split(" ")[1];
    try {
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

      console.log(res);
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
          const recipient: WebSocket | undefined = this.userSocketMap.get(message.userId);

          if (recipient && recipient.readyState === WebSocket.OPEN) {
            recipient.send(JSON.stringify({ from: req._wsUserData!.userID, content: message.content }));
          }

          await this.saveMessage(message, req._wsUserToken);

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