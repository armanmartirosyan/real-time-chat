import { WS_PORT, WS_HOST, ALLOWED_ORIGINS } from "./envConfig";
import { IVerifyClient, VerifiedJWT, VerifyClientDone } from "./types";
import http, { IncomingMessage, Server } from "http";
import { WebSocketServer, WebSocket, RawData, MessageEvent, Event } from "ws";
import TokenService from "./services/tokenService";
import { JwtPayload } from "jsonwebtoken";
import ServiceError from "./exceptions/serviceError";
import { Socket } from "node:net";

// wss.on("connection", async (ws: WebSocket, req: IncomingMessage): Promise<void> => {
//   ws.onopen = (event: Event ) => {
//     wss.clients.forEach((client) => {
//         client.send(`New User just joined. Everyone greet`);
//     });
//   }
// ws.on("message", (message: RawData, isBinary: boolean) => {
//   console.log(message.toString(), ws.);
// });
//   ws.onmessage = (event: MessageEvent) => {
//     wss.clients.forEach((client) => {
//       if (client !== ws && client.readyState === WebSocket.OPEN)
//         client.send(event.data);
//     });
//   };
// });

// server.listen(WS_PORT, "0.0.0.0", () => {
//   console.log(`Web Socket Server is listening port ${WS_PORT}`);
// });


class App {
  private httpServer: Server;
  private wss: WebSocketServer;
  private tokenService: TokenService;

  constructor() {
    this.httpServer = http.createServer();
    this.wss = new WebSocketServer({
      server: this.httpServer,
      verifyClient: this.verifyClient.bind(this),
    });
    this.tokenService = new TokenService();
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
      return done(true);
    } catch (error: any) {
      console.error("Token verification failed");
      console.error(error);
      if (error instanceof ServiceError)
        return done(false, error.status, error.message);
      return done(false, 403, "Forbidden");
    }
  }

  listen(port: number, host: string): void {
    this.httpServer.listen(port, host, () => {
      console.log(`Server is running on port ${port}`);
    });
  }

  private onConnection(): void {
    this.wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
      // ws.ping = (a) => {

      // }
    });
  }

  // private startHeartBeat(interval: number = 30000): void {
  //   setInterval(() => {
  //     this.wss.clients.forEach((client) => {
  //       if (client)
  //     });
  //   }, interval);
  // } 

  public startup(): void {
    this.listen(WS_PORT, WS_HOST);
    this.onConnection();

  }
}

export default App;