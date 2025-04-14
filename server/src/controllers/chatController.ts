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
			const { firstId, secondId }: ChatNS.createChat = req.body;
			const response: ApiNS.ApiResponse = await this.chatService.createChat(firstId, secondId);
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
			const { fId, sId } = req.query;
			const chat: ApiNS.ApiResponse = await this.chatService.getChat(fId as string, sId as string);
			res.status(200).json(chat);
			return;	
		} catch(error: any) {
			next(error);
		}
	}

}

export default ChatController;