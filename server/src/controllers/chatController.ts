import APIError from "../exceptions/apiError";
import { ChatNS, ApiNS } from "../@types/index.d";
import ChatService from "../services/chatService";
import { Request, Response, NextFunction } from "express";

class ChatController {
	chatService: ChatService;

	constructor() {
		this.chatService = new ChatService();
	}

	async createChat(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { secondUsername, chatName }: ChatNS.createChat = req.body;
      const firstId: string = req.user!.userID;
			const response: ApiNS.ApiResponse = await this.chatService.createChat(chatName, firstId, secondUsername);
			res.status(200).json(response);
			return;
		} catch (error: any) {
			next(error);
		}
	}

	async getAllChats(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { userId } = req.params;
			const chat: ApiNS.ApiResponse = await this.chatService.getAllChats(userId);
			res.status(200).json(chat);
			return;
		} catch (error: any) {
			next(error);
		}
	}

	async getChat(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { sU } = req.query;
			if (typeof sU !== "string")
				throw APIError.BadRequest("Invalid query");
			if (!req.user)
				throw APIError.UnauthorizedError();
			const fId: string = req.user.userID;
			const chat: ApiNS.ApiResponse = await this.chatService.getChat(fId, sU);
			res.status(200).json(chat);
			return;	
		} catch(error: any) {
			next(error);
		}
	}

  async updateChatName(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { chatId } = req.params;
      const { name } = req.body;
      if (!req.user)
        throw APIError.UnauthorizedError();
      const data: ApiNS.ApiResponse = await this.chatService.updateChatName(chatId, name);
      res.status(200).json(data);
      return;
    } catch (error: any) {
      next(error);
    }
  }

}

export default ChatController;