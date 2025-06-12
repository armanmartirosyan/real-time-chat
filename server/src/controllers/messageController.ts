import APIError from "../exceptions/apiError";
import { ChatNS, ApiNS } from "../@types/index.d";
import MessageService from "../services/messageService";
import { Request, Response, NextFunction } from "express";

class MessageController {
  messageService: MessageService;

  constructor() {
    this.messageService = new MessageService();
  }

  async createMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { chatId, content }: ChatNS.createMessage = req.body;
      const userId: string = req.user!.userID;
      const response: ApiNS.ApiResponse = await this.messageService.createMessage(chatId, userId, content);
      res.status(200).json(response);
      return;
    } catch (error: any) {
      next(error);
    }
  }

  async getMessages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { chatId } = req.params;
      const response: ApiNS.ApiResponse = await this.messageService.getMessages(chatId);
      res.status(200).json(response);
      return;
    } catch (error: any) {
      next(error);
    }
  }
}

export default MessageController;